<?php

namespace App\Services\Psychometrics;

class DiscDriver implements ScoringDriverInterface
{
    private array $itemMapping = [
        1 => [
            1 => ['M' => 'I', 'L' => 'I'],
            2 => ['M' => 'S', 'L' => 'S'],
            3 => ['M' => 'D', 'L' => 'D'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        2 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'C', 'L' => 'C'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'S', 'L' => 'S'],
        ],
        3 => [
            1 => ['M' => 'C', 'L' => 'C'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'I', 'L' => 'I'],
        ],
        4 => [
            1 => ['M' => 'C', 'L' => 'C'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'S', 'L' => 'S'],
        ],
        5 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        6 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        7 => [
            1 => ['M' => 'I', 'L' => 'I'],
            2 => ['M' => 'C', 'L' => 'C'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'D', 'L' => 'D'],
        ],
        8 => [
            1 => ['M' => 'I', 'L' => 'I'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        9 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'S', 'L' => 'S'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        10 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'S', 'L' => 'S'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        11 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'C', 'L' => 'C'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'D', 'L' => 'D'],
        ],
        12 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'S', 'L' => 'S'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        13 => [
            1 => ['M' => 'I', 'L' => 'I'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        14 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'S', 'L' => 'S'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        15 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        16 => [
            1 => ['M' => 'C', 'L' => 'C'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'I', 'L' => 'I'],
            4 => ['M' => 'S', 'L' => 'S'],
        ],
        17 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'C', 'L' => 'C'],
            4 => ['M' => 'D', 'L' => 'D'],
        ],
        18 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'D', 'L' => 'D'],
            3 => ['M' => 'C', 'L' => 'C'],
            4 => ['M' => 'I', 'L' => 'I'],
        ],
        19 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'C', 'L' => 'C'],
            4 => ['M' => 'D', 'L' => 'D'],
        ],
        20 => [
            1 => ['M' => 'I', 'L' => 'I'],
            2 => ['M' => 'C', 'L' => 'C'],
            3 => ['M' => 'D', 'L' => 'D'],
            4 => ['M' => 'S', 'L' => 'S'],
        ],
        21 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        22 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'C', 'L' => 'C'],
            4 => ['M' => 'D', 'L' => 'D'],
        ],
        23 => [
            1 => ['M' => 'D', 'L' => 'D'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'S', 'L' => 'S'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
        24 => [
            1 => ['M' => 'S', 'L' => 'S'],
            2 => ['M' => 'I', 'L' => 'I'],
            3 => ['M' => 'D', 'L' => 'D'],
            4 => ['M' => 'C', 'L' => 'C'],
        ],
    ];

    public function getTestType(): string
    {
        return 'disc';
    }

    /**
     * Rumus Perhitungan Tes DiSC Psikotest (24 Blok × 4 Pernyataan = 96 Kolom)
     *
     * Tujuan:
     * Mengukur 4 dimensi perilaku kerja:
     * D (Dominance), I (Influence), S (Steadiness), dan C (Conscientiousness)
     * dalam 3 sudut pandang grafik: Mask (Most), Core (Least), dan Mirror (Selisih).
     *
     * Langkah 1 — Pengelompokan 96 Kolom Menjadi 24 Blok Soal:
     * - Sistem menyaring keluar kolom metadata (`Timestamp`, `Email`, `Nama`, `Kelas`, dll.).
     * - 96 kolom pernyataan yang tersisa dikelompokkan berurutan per 4 kolom menjadi 24 blok soal (blok 1..24, baris 1..4).
     * - Setiap kombinasi `(blok, baris)` memiliki pemetaan dimensi Most (`M`) dan Least (`L`) pada `$itemMapping`.
     *
     * Langkah 2 — Perhitungan Grafik 1 (Most / Mask) & Grafik 2 (Least / Core):
     * - Jika sel bernilai `"SESUAI DIRI SAYA"` (mengandung `"SESUAI"` dan tidak mengandung `"TIDAK"`):
     *   Skor dimensi `M` pada Grafik 1 (`$mostScores`) bertambah +1. (Total ideal Grafik 1 = 24, rentang per dimensi 0..24).
     * - Jika sel bernilai `"TIDAK SESUAI DIRI SAYA"` (mengandung `"TIDAK SESUAI"`):
     *   Skor dimensi `L` pada Grafik 2 (`$leastScores`) bertambah +1. (Total ideal Grafik 2 = 24, rentang per dimensi 0..24).
     *
     * Langkah 3 — Perhitungan Grafik 3 (Mirror / Selisih M - L):
     * - Untuk setiap dimensi (D, I, S, C), dihitung selisihnya dengan rumus:
     *   `Diff[dim] = Most[dim] - Least[dim]` (rentang -24 s.d. +24).
     * - Contoh: Jika Most I = 8 dan Least I = 6, maka Diff I = 8 - 6 = +2.
     *   Jika Most D = 6 dan Least D = 8, maka Diff D = 6 - 8 = -2.
     *
     * Langkah 4 — Penentuan Kode Profil Dominan:
     * - Nilai `Diff` keempat dimensi diurutkan dari terbesar ke terkecil (`arsort`).
     * - Dimensi peringkat 1 menjadi huruf utama; jika dimensi peringkat 2 bernilai > 0, maka digabung menjadi
     *   profil 2 huruf (contoh: I=+2, S=+1, C=-1, D=-2 -> `"IS"`). Jika peringkat 2 <= 0, cukup 1 huruf (contoh: `"I"`).
     *
     * Pemetaan Kolom Tabel Database `riasec_assessments`:
     * - `user_id`              : ID siswa pemilik asesmen (relasi ke tabel `users`)
     * - `psychometric_test_id` : ID alat tes DiSC (relasi ke tabel `psychometric_tests`)
     * - `test_type`            : Bernilai `'disc'`
     * - `score_r..score_c`     : Bernilai `null` (khusus untuk tes RIASEC)
     * - `primary_result`       : Kode profil DiSC 1 atau 2 huruf (contoh: `'IS'`, `'D'`)
     * - `dominant_code`        : Diisi sama dengan `primary_result` saat sinkronisasi spreadsheet
     * - `dimension_scores`     : JSON berisi `graph1_most` (`{"D":6,"I":8,"S":5,"C":5}`), `graph2_least` (`{"D":8,"I":6,"S":4,"C":6}`),
     *                            `graph3_diff` (`{"D":-2,"I":2,"S":1,"C":-1}`), serta ringkasan `d`, `i`, `s`, `c`
     * - `raw_answers`          : JSON jawaban mentah siswa untuk blok 1..24 (masing-masing berisi baris 1..4)
     * - `interpretation`       : JSON berisi `type_name`, `summary`, `descriptions` (4 dimensi), dan `majors` (rekomendasi jurusan)
     * - `mentor_name`          : Nama guru/mentor pembimbing yang dipilih siswa atau dari spreadsheet
     * - `status`               : Status pengerjaan (`'selesai'`)
     * - `completed_at`         : Timestamp waktu selesai/sinkronisasi
     */
    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array
    {
        $rawAnswers = [];
        $answerColumns = [];

        $exactMetaHeaders = ['timestamp', 'waktu', 'tanggal', 'nama', 'nama lengkap', 'name', 'kelas', 'class', 'guru', 'mentor', 'pembimbing', 'npsn', 'sekolah', 'school'];

        foreach ($rowHeaders as $idx => $header) {
            $h = strtolower(trim(str_replace(['"', "'", "\xEF\xBB\xBF"], '', $header)));
            if (
                in_array($h, $exactMetaHeaders, true) ||
                str_contains($h, 'timestamp') ||
                str_contains($h, 'email') ||
                str_contains($h, 'surel') ||
                str_contains($h, 'username')
            ) {
                continue;
            }
            $answerColumns[] = [
                'index' => $idx,
                'header' => $header,
                'value' => trim($rowValues[$idx] ?? ''),
            ];
        }

        $mostScores = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];
        $leastScores = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];

        $colCount = count($answerColumns);
        $totalItems = min(24, (int) floor($colCount / 4));

        for ($item = 1; $item <= $totalItems; $item++) {
            $baseColIdx = ($item - 1) * 4;
            $rawAnswers[$item] = [];

            for ($row = 1; $row <= 4; $row++) {
                $curIdx = $baseColIdx + ($row - 1);
                if (!isset($answerColumns[$curIdx])) continue;

                $val = strtoupper($answerColumns[$curIdx]['value']);
                $rawAnswers[$item][$row] = $val;

                $map = $this->itemMapping[$item][$row] ?? null;
                if (!$map) continue;

                if (str_contains($val, 'SESUAI') && !str_contains($val, 'TIDAK')) {
                    $targetDim = $map['M'];
                    if (isset($mostScores[$targetDim])) {
                        $mostScores[$targetDim]++;
                    }
                } elseif (str_contains($val, 'TIDAK SESUAI')) {
                    $targetDim = $map['L'];
                    if (isset($leastScores[$targetDim])) {
                        $leastScores[$targetDim]++;
                    }
                }
            }
        }

        $diffScores = [
            'D' => $mostScores['D'] - $leastScores['D'],
            'I' => $mostScores['I'] - $leastScores['I'],
            'S' => $mostScores['S'] - $leastScores['S'],
            'C' => $mostScores['C'] - $leastScores['C'],
        ];

        arsort($diffScores);
        $topDim = array_key_first($diffScores);
        $secondDim = array_keys($diffScores)[1] ?? '';
        $profileCode = $diffScores[$secondDim] > 0 ? "{$topDim}{$secondDim}" : $topDim;

        $dimensionScores = [
            'graph1_most' => $mostScores,
            'graph2_least' => $leastScores,
            'graph3_diff' => $diffScores,
            'd' => $diffScores['D'],
            'i' => $diffScores['I'],
            's' => $diffScores['S'],
            'c' => $diffScores['C'],
        ];

        $interpretation = $this->generateRecommendations($dimensionScores, $profileCode);

        return [
            'primary_result' => $profileCode,
            'dimension_scores' => $dimensionScores,
            'raw_answers' => $rawAnswers,
            'interpretation' => $interpretation,
        ];
    }

    public function generateRecommendations(array $dimensionScores, ?string $primaryResult = null): array
    {
        $code = $primaryResult ?: 'D';
        $primaryChar = substr($code, 0, 1);

        $titles = [
            'D' => 'Dominance (Penggerak & Pengambil Keputusan)',
            'I' => 'Influence (Komunikator & Inspirator Tim)',
            'S' => 'Steadiness (Pendukung Andal & Penjaga Harmoni)',
            'C' => 'Conscientiousness (Penganalisis & Peneliti Akurat)',
            'DI' => 'Dominance - Influence (Inisiator & Pemimpin Persuasif)',
            'DS' => 'Dominance - Steadiness (Pemimpin Konsisten & Berorientasi Solusi)',
            'DC' => 'Dominance - Conscientiousness (Strategis & Berorientasi Kualitas)',
            'ID' => 'Influence - Dominance (Motivator Aktif & Visioner)',
            'IS' => 'Influence - Steadiness (Kolaborator Hangat & Diplomatik)',
            'IC' => 'Influence - Conscientiousness (Penasihat Komunikatif & Cermat)',
            'SI' => 'Steadiness - Influence (Penyemangat Rekan & Ramah)',
            'SD' => 'Steadiness - Dominance (Pekerja Keras Tabah & Bertanggung Jawab)',
            'SC' => 'Steadiness - Conscientiousness (Sistematis, Teliti & Setia)',
            'CD' => 'Conscientiousness - Dominance (Perfeksionis Cepat & Standar Tinggi)',
            'CI' => 'Conscientiousness - Influence (Evaluator Kritis & Lugas)',
            'CS' => 'Conscientiousness - Steadiness (Pekerja Prosedural & Konsisten)',
        ];

        $descriptions = [
            'D' => 'Menyukai tantangan, berorientasi hasil, mandiri, berani mengambil risiko, dan tegas dalam memimpin.',
            'I' => 'Antusias, persuasif, optimis, menyukai interaksi luas, dan pandai membangun atmosfer kerja yang dinamis.',
            'S' => 'Tenang, sabar, dapat diandalkan, setia pada kerja sama kelompok, dan menyukai stabilitas serta ritme yang terprediksi.',
            'C' => 'Objektif, sistematis, kritis, mengutamakan ketepatan, fakta, logika, dan kepatuhan terhadap standar mutu tinggi.',
        ];

        $majorMap = [
            'D' => ['Manajemen Bisnis', 'Teknik Industri', 'Ilmu Hukum', 'Kewirausahaan'],
            'I' => ['Ilmu Komunikasi', 'Hubungan Internasional', 'Marketing & Public Relations', 'Desain Komunikasi Visual'],
            'S' => ['Psikologi', 'Pendidikan & Keguruan', 'Keperawatan', 'Bimbingan Konseling'],
            'C' => ['Teknik Informatika', 'Akuntansi', 'Statistika / Data Science', 'Farmasi / Kedokteran'],
        ];

        $suggested = $majorMap[$primaryChar] ?? $majorMap['D'];
        if (strlen($code) > 1) {
            $secondChar = substr($code, 1, 1);
            if (isset($majorMap[$secondChar])) {
                $suggested = array_merge($suggested, array_slice($majorMap[$secondChar], 0, 2));
            }
        }

        return [
            'type_name' => $titles[$code] ?? $titles[$primaryChar] ?? "Tipe DiSC {$code}",
            'summary' => $descriptions[$primaryChar] ?? '',
            'descriptions' => $descriptions,
            'majors' => array_values(array_unique($suggested)),
        ];
    }
}

