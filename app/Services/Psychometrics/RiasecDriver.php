<?php

namespace App\Services\Psychometrics;

class RiasecDriver implements ScoringDriverInterface
{
    private array $itemMap = [
        'r' => [1, 3, 7, 14, 21, 22, 37],
        'i' => [2, 11, 18, 19, 26, 32, 33],
        'a' => [8, 17, 20, 23, 27, 31, 41],
        's' => [4, 12, 13, 28, 34, 38, 40],
        'e' => [5, 10, 15, 16, 29, 36, 42],
        'c' => [6, 9, 24, 25, 35, 38, 39],
    ];

    public function getTestType(): string
    {
        return 'riasec';
    }

    /**
     * Rumus Perhitungan Tes Holland (RIASEC)
     *
     * Tujuan:
     * Mengukur 6 tipe minat karir & kepribadian kerja:
     * R (Realistic), I (Investigative), A (Artistic), S (Social), E (Enterprising), dan C (Conventional).
     *
     * Langkah 1 — Pembacaan Data dari CSV/Spreadsheet:
     * - Mode Skor Eksplisit:
     *   Jika header CSV sudah menyediakan kolom nilai langsung (`score_r`/`skor_r`/`r`/`realistic`, dst.),
     *   maka nilai tersebut langsung dipakai sebagai skor dimensi tanpa menghitung ulang butir soal.
     * - Mode Jawaban Butir Soal (Standar Google Form Gen-U):
     *   a) Jika header kolom mengandung angka (misal "1. Saya suka..."), nomor butir diambil dari angka tersebut.
     *   b) Jika header kolom berupa kalimat pernyataan tanpa nomor (misal "Aku suka mengulik peralatan"),
     *      sistem melewati kolom metadata (`Timestamp`, `Email`, `Nama`, `Kelas`, `Guru`, dll.),
     *      lalu memetakan kolom pernyataan secara berurutan sebagai butir 1, 2, 3, ..., N.
     *
     * Langkah 2 — Pemberian Skor Tiap Butir Jawaban:
     * Setiap jawaban siswa dikonversi menjadi poin numerik:
     * - `SS` / `Sangat Setuju` / `Sangat Sesuai` / `Ya` / `4`  => +3 poin
     * - `S`  / `Setuju` / `Sesuai` / `Ragu` / `Netral` / `3`     => +2 poin
     * - `TS` / `Tidak Setuju` / `Kurang Setuju` / `2`            => +1 poin
     * - `STS`/ `Sangat Tidak Setuju` / `Tidak` / `0` / `1`       =>  0 poin
     *
     * Langkah 3 — Penjumlahan Skor per Dimensi (berdasarkan `$itemMap`):
     * Setiap dimensi menjumlahkan poin dari 7 butir soal pasangannya (rentang skor tiap dimensi: 0 s.d. 21):
     * - R = jumlah poin butir [1, 3, 7, 14, 21, 22, 37]
     * - I = jumlah poin butir [2, 11, 18, 19, 26, 32, 33]
     * - A = jumlah poin butir [8, 17, 20, 23, 27, 31, 41]
     * - S = jumlah poin butir [4, 12, 13, 28, 34, 38, 40]
     * - E = jumlah poin butir [5, 10, 15, 16, 29, 36, 42]
     * - C = jumlah poin butir [6, 9, 24, 25, 35, 38, 39]
     *
     * Langkah 4 — Penentuan Kode Profil Dominan:
     * - Keenam skor dimensi diurutkan dari nilai tertinggi ke terendah (`arsort`).
     * - Diambil 3 huruf dimensi teratas lalu digabung menjadi kode 3 huruf.
     * - Contoh: Jika S=14, I=9, E=9, C=9, R=8, A=8 -> 3 teratas adalah `S`, `I`, `E` -> hasil `"SIE"`.
     *
     * Pemetaan Kolom Tabel Database `riasec_assessments`:
     * - `user_id`              : ID siswa pemilik asesmen (relasi ke tabel `users`)
     * - `psychometric_test_id` : ID alat tes RIASEC (relasi ke tabel `psychometric_tests`)
     * - `test_type`            : Bernilai `'riasec'`
     * - `score_r`              : Skor total dimensi Realistic (integer 0-21)
     * - `score_i`              : Skor total dimensi Investigative (integer 0-21)
     * - `score_a`              : Skor total dimensi Artistic (integer 0-21)
     * - `score_s`              : Skor total dimensi Social (integer 0-21)
     * - `score_e`              : Skor total dimensi Enterprising (integer 0-21)
     * - `score_c`              : Skor total dimensi Conventional (integer 0-21)
     * - `dominant_code`        : Kode 3 huruf dominan (contoh: `'SIE'`)
     * - `primary_result`       : Sama dengan `dominant_code` (contoh: `'SIE'`)
     * - `dimension_scores`     : JSON skor keenam dimensi, contoh: `{"r":8,"i":9,"a":8,"s":14,"e":9,"c":9}`
     * - `raw_answers`          : JSON jawaban mentah per nomor butir, contoh: `{"1":"TS","2":"STS",...}`
     * - `interpretation`       : JSON berisi `type_name`, `summary`, `dimensions` (deskripsi 6 tipe), dan `majors` (rekomendasi jurusan)
     * - `mentor_name`          : Nama guru/mentor pembimbing yang dipilih siswa atau dari spreadsheet
     * - `status`               : Status pengerjaan (`'selesai'`)
     * - `completed_at`         : Timestamp waktu selesai/sinkronisasi
     */
    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array
    {
        $scores = ['r' => 0, 'i' => 0, 'a' => 0, 's' => 0, 'e' => 0, 'c' => 0];
        $rawAnswers = [];
        $explicitScoresFound = false;
        $questionColumns = [];
        $exactMetaHeaders = ['timestamp', 'waktu', 'tanggal', 'nama', 'nama lengkap', 'name', 'full name', 'kelas', 'class', 'absen', 'no absen', 'attendance', 'guru', 'mentor', 'guru pembimbing', 'pembimbing', 'npsn', 'sekolah', 'asal sekolah', 'school', 'dominant_code', 'kode_dominan', 'kode', 'hasil'];
        $metaKeywords = ['timestamp', 'email', 'surel', 'username', 'npsn'];

        foreach ($rowHeaders as $idx => $header) {
            $h = strtolower(trim(str_replace(['"', "'", "\xEF\xBB\xBF"], '', $header)));
            $val = trim($rowValues[$idx] ?? '');

            if (in_array($h, ['score_r', 'skor_r', 'r', 'realistic']) && is_numeric($val)) {
                $scores['r'] = (int) $val;
                $explicitScoresFound = true;
                continue;
            } elseif (in_array($h, ['score_i', 'skor_i', 'i', 'investigative']) && is_numeric($val)) {
                $scores['i'] = (int) $val;
                $explicitScoresFound = true;
                continue;
            } elseif (in_array($h, ['score_a', 'skor_a', 'a', 'artistic']) && is_numeric($val)) {
                $scores['a'] = (int) $val;
                $explicitScoresFound = true;
                continue;
            } elseif (in_array($h, ['score_s', 'skor_s', 's', 'social']) && is_numeric($val)) {
                $scores['s'] = (int) $val;
                $explicitScoresFound = true;
                continue;
            } elseif (in_array($h, ['score_e', 'skor_e', 'e', 'enterprising']) && is_numeric($val)) {
                $scores['e'] = (int) $val;
                $explicitScoresFound = true;
                continue;
            } elseif (in_array($h, ['score_c', 'skor_c', 'c', 'conventional']) && is_numeric($val)) {
                $scores['c'] = (int) $val;
                $explicitScoresFound = true;
                continue;
            }

            if (preg_match('/(?:pertanyaan|butir|soal|p)?\s*(\d{1,2})/i', $h, $m)) {
                $num = (int) $m[1];
                $rawAnswers[$num] = $val;
            }

            $isMeta = in_array($h, $exactMetaHeaders, true);
            if (!$isMeta) {
                foreach ($metaKeywords as $keyword) {
                    if (str_contains($h, $keyword)) {
                        $isMeta = true;
                        break;
                    }
                }
            }
            if (!$isMeta && $h !== '') {
                $questionColumns[] = $val;
            }
        }

        if (empty($rawAnswers) && !empty($questionColumns)) {
            foreach ($questionColumns as $posIdx => $val) {
                $rawAnswers[$posIdx + 1] = $val;
            }
        }

        if (!$explicitScoresFound && !empty($rawAnswers)) {
            foreach ($this->itemMap as $dim => $items) {
                $dimScore = 0;
                foreach ($items as $itemNum) {
                    $ans = strtolower(trim($rawAnswers[$itemNum] ?? ''));
                    if ($ans === '') {
                        continue;
                    }

                    if (
                        in_array($ans, ['ss', 'sangat setuju', 'sangat sesuai', 'sangat suka', 'ya', 'yes', 'true', '4']) ||
                        str_contains($ans, 'sangat setuju') ||
                        str_contains($ans, 'sangat sesuai')
                    ) {
                        $dimScore += 3;
                    } elseif (
                        in_array($ans, ['s', 'setuju', 'sesuai', 'suka', 'ragu', 'mungkin', 'netral', 'cukup', '3'])
                    ) {
                        $dimScore += 2;
                    } elseif (
                        in_array($ans, ['ts', 'tidak setuju', 'kurang setuju', 'kurang sesuai', '2']) ||
                        (str_contains($ans, 'tidak setuju') && !str_contains($ans, 'sangat'))
                    ) {
                        $dimScore += 1;
                    } elseif (
                        in_array($ans, ['sts', 'sangat tidak setuju', 'sangat tidak sesuai', 'tidak', 'no', 'false', '0', '1']) ||
                        str_contains($ans, 'sangat tidak')
                    ) {
                        $dimScore += 0;
                    } elseif (!str_contains($ans, 'tidak')) {
                        $dimScore += 1;
                    }
                }
                $scores[$dim] = $dimScore;
            }
        }

        arsort($scores);
        $top3 = array_slice($scores, 0, 3, true);
        $dominantCode = strtoupper(implode('', array_keys($top3)));

        $interpretation = $this->generateRecommendations($scores, $dominantCode);

        return [
            'primary_result' => $dominantCode,
            'dominant_code' => $dominantCode,
            'dimension_scores' => $scores,
            'raw_answers' => $rawAnswers,
            'interpretation' => $interpretation,
        ];
    }

    public function generateRecommendations(array $dimensionScores, ?string $primaryResult = null): array
    {
        $code = $primaryResult ?: 'RIA';
        $descriptions = [
            'R' => 'Praktis, mekanikal, suka bekerja dengan benda nyata, mesin, dan alam terbuka.',
            'I' => 'Analitis, rasa ingin tahu tinggi, pemikir mendalam, ilmiah dan observatif.',
            'A' => 'Ekspresif, orisinal, intuitif, berjiwa seni dan menyukai kebebasan berkarya.',
            'S' => 'Empatik, komunikatif, suka menolong, mengajar, dan berinteraksi sosial.',
            'E' => 'Percaya diri, persuasif, memiliki jiwa kepemimpinan, dan orientasi wirausaha.',
            'C' => 'Terstruktur, teliti, menyukai data teratur, terencana, dan prosedural.',
        ];

        $majorSuggestions = [
            'R' => ['Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Ilmu Komputer'],
            'I' => ['Kedokteran', 'Farmasi', 'Bioteknologi', 'Fisika / Matematika', 'Psikologi'],
            'A' => ['Desain Komunikasi Visual', 'Arsitektur', 'Seni Rupa & Desain', 'Sastra'],
            'S' => ['Pendidikan / Keguruan', 'Ilmu Komunikasi', 'Kesejahteraan Sosial', 'Keperawatan'],
            'E' => ['Manajemen Bisnis', 'Ilmu Hukum', 'Hubungan Internasional', 'Ekonomi'],
            'C' => ['Akuntansi', 'Sistem Informasi', 'Statistika', 'Perbankan & Keuangan'],
        ];

        $suggestedMajors = [];
        $chars = str_split($code);
        foreach ($chars as $c) {
            if (isset($majorSuggestions[$c])) {
                $suggestedMajors = array_merge($suggestedMajors, $majorSuggestions[$c]);
            }
        }

        return [
            'type_name' => 'Tipe RIASEC: ' . $code,
            'summary' => 'Kombinasi minat dominan ' . implode(', ', array_map(fn($c) => $descriptions[$c] ?? '', $chars)),
            'dimensions' => $descriptions,
            'majors' => array_values(array_unique($suggestedMajors)),
        ];
    }
}

