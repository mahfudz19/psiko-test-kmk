<?php

namespace App\Services\Psychometrics;

class PapiKostickDriver implements ScoringDriverInterface
{
    private array $itemPairs = [
        1 => ['a' => 'G', 'b' => 'E'],
        2 => ['a' => 'A', 'b' => 'N'],
        3 => ['a' => 'P', 'b' => 'A'],
        4 => ['a' => 'X', 'b' => 'P'],
        5 => ['a' => 'B', 'b' => 'X'],
        6 => ['a' => 'O', 'b' => 'B'],
        7 => ['a' => 'Z', 'b' => 'O'],
        8 => ['a' => 'K', 'b' => 'Z'],
        9 => ['a' => 'F', 'b' => 'K'],
        10 => ['a' => 'W', 'b' => 'F'],
        11 => ['a' => 'G', 'b' => 'C'],
        12 => ['a' => 'L', 'b' => 'G'],
        13 => ['a' => 'I', 'b' => 'N'],
        14 => ['a' => 'T', 'b' => 'A'],
        15 => ['a' => 'V', 'b' => 'P'],
        16 => ['a' => 'S', 'b' => 'X'],
        17 => ['a' => 'R', 'b' => 'B'],
        18 => ['a' => 'D', 'b' => 'O'],
        19 => ['a' => 'C', 'b' => 'Z'],
        20 => ['a' => 'E', 'b' => 'K'],
        21 => ['a' => 'W', 'b' => 'F'],
        22 => ['a' => 'G', 'b' => 'D'],
        23 => ['a' => 'A', 'b' => 'R'],
        24 => ['a' => 'L', 'b' => 'P'],
        25 => ['a' => 'I', 'b' => 'X'],
        26 => ['a' => 'T', 'b' => 'B'],
        27 => ['a' => 'V', 'b' => 'O'],
        28 => ['a' => 'S', 'b' => 'Z'],
        29 => ['a' => 'R', 'b' => 'K'],
        30 => ['a' => 'D', 'b' => 'F'],
        31 => ['a' => 'C', 'b' => 'W'],
        32 => ['a' => 'G', 'b' => 'R'],
        33 => ['a' => 'A', 'b' => 'S'],
        34 => ['a' => 'P', 'b' => 'V'],
        35 => ['a' => 'L', 'b' => 'X'],
        36 => ['a' => 'I', 'b' => 'B'],
        37 => ['a' => 'T', 'b' => 'O'],
        38 => ['a' => 'V', 'b' => 'Z'],
        39 => ['a' => 'S', 'b' => 'K'],
        40 => ['a' => 'R', 'b' => 'F'],
        41 => ['a' => 'D', 'b' => 'W'],
        42 => ['a' => 'C', 'b' => 'G'],
        43 => ['a' => 'E', 'b' => 'S'],
        44 => ['a' => 'N', 'b' => 'V'],
        45 => ['a' => 'A', 'b' => 'T'],
        46 => ['a' => 'P', 'b' => 'I'],
        47 => ['a' => 'X', 'b' => 'L'],
        48 => ['a' => 'B', 'b' => 'T'],
        49 => ['a' => 'O', 'b' => 'V'],
        50 => ['a' => 'Z', 'b' => 'S'],
        51 => ['a' => 'K', 'b' => 'R'],
        52 => ['a' => 'F', 'b' => 'D'],
        53 => ['a' => 'W', 'b' => 'C'],
        54 => ['a' => 'G', 'b' => 'E'],
        55 => ['a' => 'L', 'b' => 'N'],
        56 => ['a' => 'I', 'b' => 'A'],
        57 => ['a' => 'T', 'b' => 'P'],
        58 => ['a' => 'V', 'b' => 'X'],
        59 => ['a' => 'S', 'b' => 'B'],
        60 => ['a' => 'R', 'b' => 'O'],
        61 => ['a' => 'D', 'b' => 'Z'],
        62 => ['a' => 'C', 'b' => 'K'],
        63 => ['a' => 'E', 'b' => 'F'],
        64 => ['a' => 'N', 'b' => 'W'],
        65 => ['a' => 'G', 'b' => 'I'],
        66 => ['a' => 'A', 'b' => 'L'],
        67 => ['a' => 'P', 'b' => 'T'],
        68 => ['a' => 'X', 'b' => 'V'],
        69 => ['a' => 'B', 'b' => 'S'],
        70 => ['a' => 'O', 'b' => 'R'],
        71 => ['a' => 'Z', 'b' => 'D'],
        72 => ['a' => 'K', 'b' => 'C'],
        73 => ['a' => 'F', 'b' => 'E'],
        74 => ['a' => 'W', 'b' => 'N'],
        75 => ['a' => 'G', 'b' => 'L'],
        76 => ['a' => 'A', 'b' => 'I'],
        77 => ['a' => 'P', 'b' => 'T'],
        78 => ['a' => 'X', 'b' => 'V'],
        79 => ['a' => 'B', 'b' => 'S'],
        80 => ['a' => 'O', 'b' => 'R'],
        81 => ['a' => 'Z', 'b' => 'D'],
        82 => ['a' => 'K', 'b' => 'C'],
        83 => ['a' => 'F', 'b' => 'E'],
        84 => ['a' => 'W', 'b' => 'N'],
        85 => ['a' => 'S', 'b' => 'T'],
        86 => ['a' => 'B', 'b' => 'R'],
        87 => ['a' => 'R', 'b' => 'D'],
        88 => ['a' => 'D', 'b' => 'C'],
        89 => ['a' => 'C', 'b' => 'O'],
        90 => ['a' => 'W', 'b' => 'N'],
    ];

    public function getTestType(): string
    {
        return 'papi_kostick';
    }

    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array
    {
        $aspects = [
            'G' => 0, 'L' => 0, 'I' => 0, 'T' => 0, 'V' => 0,
            'S' => 0, 'R' => 0, 'D' => 0, 'C' => 0, 'E' => 0,
            'N' => 0, 'A' => 0, 'P' => 0, 'X' => 0, 'B' => 0,
            'O' => 0, 'Z' => 0, 'K' => 0, 'F' => 0, 'W' => 0,
        ];

        $rawAnswers = [];

        foreach ($rowHeaders as $idx => $header) {
            $h = trim($header);
            $val = trim($rowValues[$idx] ?? '');

            if (preg_match('/^(\d{1,2})\.?$/', $h, $m)) {
                $num = (int) $m[1];
                $rawAnswers[$num] = $val;
            }
        }

        for ($i = 1; $i <= 90; $i++) {
            $ans = strtolower(trim($rawAnswers[$i] ?? ''));
            $choice = '';
            if (str_starts_with($ans, 'a') || str_contains($ans, 'a.')) {
                $choice = 'a';
            } elseif (str_starts_with($ans, 'b') || str_contains($ans, 'b.')) {
                $choice = 'b';
            }

            if ($choice !== '' && isset($this->itemPairs[$i][$choice])) {
                $aspect = $this->itemPairs[$i][$choice];
                if (isset($aspects[$aspect])) {
                    $aspects[$aspect]++;
                }
            }
        }

        arsort($aspects);
        $topAspects = array_slice($aspects, 0, 3, true);
        $topStr = implode('-', array_map(fn($k, $v) => "{$k}:{$v}", array_keys($topAspects), $topAspects));

        $interpretation = $this->generateRecommendations($aspects, $topStr);

        return [
            'primary_result' => $topStr,
            'dimension_scores' => $aspects,
            'raw_answers' => $rawAnswers,
            'interpretation' => $interpretation,
        ];
    }

    public function generateRecommendations(array $dimensionScores, ?string $primaryResult = null): array
    {
        $aspectNames = [
            'G' => ['name' => 'Hard Intense Worker', 'area' => 'Arah Kerja', 'desc' => 'Peran pekerja keras, tekun, dan mengerahkan energi tinggi dalam bekerja.'],
            'L' => ['name' => 'Leadership Role', 'area' => 'Kepemimpinan', 'desc' => 'Peran kepemimpinan aktif, menggerakkan tim, dan mengambil inisiatif kelompok.'],
            'I' => ['name' => 'Ease in Decision Making', 'area' => 'Kepemimpinan', 'desc' => 'Kemudahan dan kecepatan dalam mengambil keputusan serta menghadapi risiko.'],
            'T' => ['name' => 'Pace', 'area' => 'Aktivitas', 'desc' => 'Tempo kerja tinggi, dinamis, aktif, dan menyukai ritme tugas yang cepat.'],
            'V' => ['name' => 'Vigorous Type', 'area' => 'Aktivitas', 'desc' => 'Vitalitas fisik prima, menyukai aktivitas lapangan dan gerakan fisik.'],
            'S' => ['name' => 'Social Extension', 'area' => 'Sifat Sosial', 'desc' => 'Perhatian pada hubungan interpersonal, ramah, dan mudah membangun jejaring sosial.'],
            'R' => ['name' => 'Theoretical Type', 'area' => 'Gaya Kerja', 'desc' => 'Tipe analitis-teoretis, menyukai pemecahan masalah konseptual dan abstraksi logis.'],
            'D' => ['name' => 'Interest in Details', 'area' => 'Gaya Kerja', 'desc' => 'Kecermatan tinggi, teliti pada detail, akurasi, dan ketuntasan data.'],
            'C' => ['name' => 'Organized Type', 'area' => 'Gaya Kerja', 'desc' => 'Terstruktur, teratur, menyukai sistematisasi dan perencanaan kerja.'],
            'E' => ['name' => 'Emotional Restraint', 'area' => 'Temperamen', 'desc' => 'Pengendalian emosi yang matang, tenang, tidak mudah terpicu stres atau murung.'],
            'N' => ['name' => 'Need to Finish Task', 'area' => 'Arah Kerja', 'desc' => 'Kebutuhan tinggi untuk menuntaskan tugas secara sempurna sebelum beralih.'],
            'A' => ['name' => 'Need to Achieve', 'area' => 'Arah Kerja', 'desc' => 'Dorongan kuat untuk berprestasi, kompetitif, dan meraih puncak keberhasilan.'],
            'P' => ['name' => 'Need to Control Others', 'area' => 'Kepemimpinan', 'desc' => 'Dorongan untuk mengarahkan, mengatur, dan mengendalikan langkah orang lain.'],
            'X' => ['name' => 'Need to be Noticed', 'area' => 'Sifat Sosial', 'desc' => 'Kebutuhan untuk tampil menonjol, diperhatikan, dan diakui eksistensinya.'],
            'B' => ['name' => 'Need to Belong to Groups', 'area' => 'Sifat Sosial', 'desc' => 'Kebutuhan menjadi bagian dari kelompok sosial, diterima, dan kompak.'],
            'O' => ['name' => 'Need for Closeness', 'area' => 'Sifat Sosial', 'desc' => 'Kebutuhan akan kehangatan emosional dan persahabatan yang akrab serta mendalam.'],
            'Z' => ['name' => 'Need for Change', 'area' => 'Temperamen', 'desc' => 'Kebutuhan akan variasi, hal baru, petualangan, dan tidak menyukai rutinitas monoton.'],
            'K' => ['name' => 'Need to be Forceful', 'area' => 'Temperamen', 'desc' => 'Ketegasan, dorongan mempertahankan hak, membela diri, dan berani konfrontasi konstruktif.'],
            'F' => ['name' => 'Need for Support from Authority', 'area' => 'Ketaatan', 'desc' => 'Kebutuhan akan arahan, bimbingan, dan dukungan dari figur pembimbing/dosen.'],
            'W' => ['name' => 'Need for Rules and Supervision', 'area' => 'Ketaatan', 'desc' => 'Kebutuhan terhadap regulasi yang jelas, pedoman tertulis, dan kepatuhan aturan.'],
        ];

        $areas = [
            'Arah Kerja' => ['N' => $dimensionScores['N'] ?? 0, 'G' => $dimensionScores['G'] ?? 0, 'A' => $dimensionScores['A'] ?? 0],
            'Kepemimpinan' => ['L' => $dimensionScores['L'] ?? 0, 'P' => $dimensionScores['P'] ?? 0, 'I' => $dimensionScores['I'] ?? 0],
            'Aktivitas' => ['T' => $dimensionScores['T'] ?? 0, 'V' => $dimensionScores['V'] ?? 0],
            'Sifat Sosial' => ['X' => $dimensionScores['X'] ?? 0, 'S' => $dimensionScores['S'] ?? 0, 'B' => $dimensionScores['B'] ?? 0, 'O' => $dimensionScores['O'] ?? 0],
            'Gaya Kerja' => ['R' => $dimensionScores['R'] ?? 0, 'D' => $dimensionScores['D'] ?? 0, 'C' => $dimensionScores['C'] ?? 0],
            'Temperamen' => ['Z' => $dimensionScores['Z'] ?? 0, 'E' => $dimensionScores['E'] ?? 0, 'K' => $dimensionScores['K'] ?? 0],
            'Ketaatan' => ['F' => $dimensionScores['F'] ?? 0, 'W' => $dimensionScores['W'] ?? 0],
        ];

        arsort($dimensionScores);
        $top3Keys = array_slice(array_keys($dimensionScores), 0, 3);
        $top3Highlights = array_map(function ($k) use ($aspectNames, $dimensionScores) {
            return [
                'code' => $k,
                'score' => $dimensionScores[$k],
                'name' => $aspectNames[$k]['name'],
                'area' => $aspectNames[$k]['area'],
                'desc' => $aspectNames[$k]['desc'],
            ];
        }, $top3Keys);

        $suggestedMajors = [];
        if (($dimensionScores['R'] ?? 0) >= 6 || ($dimensionScores['I'] ?? 0) >= 6) {
            $suggestedMajors[] = 'Teknik Informatika & Ilmu Komputer';
            $suggestedMajors[] = 'Matematika & Sains Terapan';
        }
        if (($dimensionScores['L'] ?? 0) >= 6 || ($dimensionScores['P'] ?? 0) >= 6 || ($dimensionScores['A'] ?? 0) >= 6) {
            $suggestedMajors[] = 'Manajemen Bisnis & Kewirausahaan';
            $suggestedMajors[] = 'Ilmu Hukum';
        }
        if (($dimensionScores['S'] ?? 0) >= 6 || ($dimensionScores['O'] ?? 0) >= 6 || ($dimensionScores['B'] ?? 0) >= 6) {
            $suggestedMajors[] = 'Ilmu Komunikasi & Hubungan Masyarakat';
            $suggestedMajors[] = 'Psikologi & Bimbingan Konseling';
        }
        if (($dimensionScores['D'] ?? 0) >= 6 || ($dimensionScores['C'] ?? 0) >= 6) {
            $suggestedMajors[] = 'Akuntansi & Keuangan';
            $suggestedMajors[] = 'Sistem Informasi';
        }
        if (($dimensionScores['V'] ?? 0) >= 6 || ($dimensionScores['Z'] ?? 0) >= 6) {
            $suggestedMajors[] = 'Teknik Sipil / Perencanaan Wilayah';
            $suggestedMajors[] = 'Pariwisata & Manajemen Perhotelan';
        }

        if (empty($suggestedMajors)) {
            $suggestedMajors = ['Manajemen Bisnis', 'Ilmu Komunikasi', 'Teknik Informatika'];
        }

        return [
            'type_name' => 'Profil PAPI Kostick',
            'summary' => 'Menunjukkan dinamika kerja dominan pada ' . implode(', ', array_column($top3Highlights, 'name')),
            'areas' => $areas,
            'top_aspects' => $top3Highlights,
            'aspect_details' => $aspectNames,
            'majors' => array_values(array_unique($suggestedMajors)),
        ];
    }
}

