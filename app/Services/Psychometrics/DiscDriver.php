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

    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array
    {
        $rawAnswers = [];
        $answerColumns = [];

        foreach ($rowHeaders as $idx => $header) {
            $h = strtolower(trim($header));
            if (str_contains($h, 'timestamp') || str_contains($h, 'email') || str_contains($h, 'waktu') || str_contains($h, 'nama') || str_contains($h, 'kelas')) {
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

