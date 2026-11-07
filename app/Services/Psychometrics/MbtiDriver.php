<?php

namespace App\Services\Psychometrics;

class MbtiDriver implements ScoringDriverInterface
{
    private array $itemDimensions = [
        1 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        2 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        3 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        4 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        5 => ['dim' => 'EI', 'a' => 'E', 'b' => 'I'],
        6 => ['dim' => 'SN', 'a' => 'N', 'b' => 'S'],
        7 => ['dim' => 'EI', 'a' => 'E', 'b' => 'I'],
        8 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        9 => ['dim' => 'TF', 'a' => 'F', 'b' => 'T'],
        10 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        11 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        12 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        13 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        14 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        15 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        16 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        17 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        18 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        19 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        20 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        21 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        22 => ['dim' => 'SN', 'a' => 'N', 'b' => 'S'],
        23 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        24 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        25 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        26 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        27 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        28 => ['dim' => 'EI', 'a' => 'E', 'b' => 'I'],
        29 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        30 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        31 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        32 => ['dim' => 'TF', 'a' => 'F', 'b' => 'T'],
        33 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        34 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        35 => ['dim' => 'EI', 'a' => 'E', 'b' => 'I'],
        36 => ['dim' => 'SN', 'a' => 'N', 'b' => 'S'],
        37 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        38 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        39 => ['dim' => 'TF', 'a' => 'F', 'b' => 'T'],
        40 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        41 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        42 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        43 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        44 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        45 => ['dim' => 'EI', 'a' => 'I', 'b' => 'E'],
        46 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        47 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        48 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        49 => ['dim' => 'TF', 'a' => 'F', 'b' => 'T'],
        50 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        51 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        52 => ['dim' => 'EI', 'a' => 'E', 'b' => 'I'],
        53 => ['dim' => 'SN', 'a' => 'S', 'b' => 'N'],
        54 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        55 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        56 => ['dim' => 'JP', 'a' => 'J', 'b' => 'P'],
        57 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        58 => ['dim' => 'TF', 'a' => 'T', 'b' => 'F'],
        59 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
        60 => ['dim' => 'JP', 'a' => 'P', 'b' => 'J'],
    ];

    public function getTestType(): string
    {
        return 'mbti';
    }

    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array
    {
        $rawAnswers = [];

        foreach ($rowHeaders as $idx => $header) {
            $h = trim($header);
            $val = trim($rowValues[$idx] ?? '');

            if (preg_match('/^(\d{1,2})\.?$/', $h, $m)) {
                $num = (int) $m[1];
                $rawAnswers[$num] = $val;
            }
        }

        $scores = [
            'E' => 0, 'I' => 0,
            'S' => 0, 'N' => 0,
            'T' => 0, 'F' => 0,
            'J' => 0, 'P' => 0,
        ];

        for ($i = 1; $i <= 60; $i++) {
            $ans = trim($rawAnswers[$i] ?? '');
            $choice = strtoupper(substr($ans, 0, 1));

            if (($choice === 'A' || $choice === 'B') && isset($this->itemDimensions[$i])) {
                $targetPole = $choice === 'A' ? $this->itemDimensions[$i]['a'] : $this->itemDimensions[$i]['b'];
                if (isset($scores[$targetPole])) {
                    $scores[$targetPole]++;
                }
            }
        }

        $eOrI = $scores['E'] >= $scores['I'] ? 'E' : 'I';
        $sOrN = $scores['S'] >= $scores['N'] ? 'S' : 'N';
        $tOrF = $scores['T'] >= $scores['F'] ? 'T' : 'F';
        $jOrP = $scores['J'] >= $scores['P'] ? 'J' : 'P';

        $mbtiType = "{$eOrI}{$sOrN}{$tOrF}{$jOrP}";

        $totalEI = max(1, $scores['E'] + $scores['I']);
        $totalSN = max(1, $scores['S'] + $scores['N']);
        $totalTF = max(1, $scores['T'] + $scores['F']);
        $totalJP = max(1, $scores['J'] + $scores['P']);

        $percentages = [
            'E' => round(($scores['E'] / $totalEI) * 100),
            'I' => round(($scores['I'] / $totalEI) * 100),
            'S' => round(($scores['S'] / $totalSN) * 100),
            'N' => round(($scores['N'] / $totalSN) * 100),
            'T' => round(($scores['T'] / $totalTF) * 100),
            'F' => round(($scores['F'] / $totalTF) * 100),
            'J' => round(($scores['J'] / $totalJP) * 100),
            'P' => round(($scores['P'] / $totalJP) * 100),
        ];

        $dimensionScores = array_merge($scores, ['percentages' => $percentages]);
        $interpretation = $this->generateRecommendations($dimensionScores, $mbtiType);

        return [
            'primary_result' => $mbtiType,
            'dominant_code' => $mbtiType,
            'dimension_scores' => $dimensionScores,
            'raw_answers' => $rawAnswers,
            'interpretation' => $interpretation,
        ];
    }

    public function generateRecommendations(array $dimensionScores, ?string $primaryResult = null): array
    {
        $type = $primaryResult ?: 'ENFP';

        $typesData = [
            'INTJ' => [
                'name' => 'The Architect (Ahli Strategi Visioner)',
                'summary' => 'Pemikir imajinatif dan strategis, dengan rencana untuk segala sesuatunya.',
                'majors' => ['Teknik Informatika', 'Data Science', 'Fisika Teoretis', 'Teknik Elektro', 'Ilmu Hukum'],
            ],
            'INTP' => [
                'name' => 'The Logician (Pemikir Inovatif)',
                'summary' => 'Penemu inovatif dengan kehausan tak terpadamkan akan pengetahuan logis.',
                'majors' => ['Ilmu Komputer / Software Engineering', 'Matematika Murni', 'Filsafat', 'Bioteknologi'],
            ],
            'ENTJ' => [
                'name' => 'The Commander (Pemimpin Tegas & Berani)',
                'summary' => 'Pemimpin pemberani, imajinatif, dan berkemauan keras, selalu menemukan jalan atau membuatnya.',
                'majors' => ['Manajemen Bisnis', 'Ilmu Hukum', 'Ekonomi Pembangunan', 'Teknik Industri'],
            ],
            'ENTP' => [
                'name' => 'The Debater (Inovator Cerdas & Argumentatif)',
                'summary' => 'Pemikir cerdas dan ingin tahu yang tidak bisa menolak tantangan intelektual.',
                'majors' => ['Hubungan Internasional', 'Ilmu Komunikasi', 'Kewirausahaan Bisnis', 'Teknik Elektro'],
            ],
            'INFJ' => [
                'name' => 'The Advocate (Idealis Visioner)',
                'summary' => 'Idealis yang tenang dan mistis, namun sangat menginspirasi dan tidak kenal lelah.',
                'majors' => ['Psikologi', 'Sastra & Bahasa', 'Kesejahteraan Sosial', 'Desain Komunikasi Visual'],
            ],
            'INFP' => [
                'name' => 'The Mediator (Penyair Idealis & Empatis)',
                'summary' => 'Orang puitis, baik hati, dan altruistik, selalu bersemangat membantu tujuan yang baik.',
                'majors' => ['Sastra Indonesia / Inggris', 'Psikologi', 'Seni Rupa', 'Hubungan Masyarakat'],
            ],
            'ENFJ' => [
                'name' => 'The Protagonist (Pemimpin Karismatik & Inspirator)',
                'summary' => 'Pemimpin karismatik dan menginspirasi, mampu memukau para pendengarnya.',
                'majors' => ['Pendidikan / Keguruan', 'Ilmu Komunikasi', 'Manajemen SDM', 'Sosiologi'],
            ],
            'ENFP' => [
                'name' => 'The Campaigner (Penuh Semangat & Eksploratif)',
                'summary' => 'Pribadi berjiwa bebas, antusias, kreatif, dan mudah bergaul, selalu menemukan alasan untuk tersenyum.',
                'majors' => ['Ilmu Komunikasi', 'Desain Komunikasi Visual', 'Hubungan Internasional', 'Marketing'],
            ],
            'ISTJ' => [
                'name' => 'The Logistician (Praktis, Faktual & Andal)',
                'summary' => 'Pribadi praktis dan mengutamakan fakta, yang keandalannya tidak diragukan lagi.',
                'majors' => ['Akuntansi', 'Sistem Informasi', 'Teknik Sipil', 'Manajemen Logistik'],
            ],
            'ISFJ' => [
                'name' => 'The Defender (Pelindung Hangat & Berdedikasi)',
                'summary' => 'Pelindung yang sangat berdedikasi dan hangat, selalu siap membela orang yang mereka sayangi.',
                'majors' => ['Keperawatan / Farmasi', 'Pendidikan Anak Usia Dini', 'Administrasi Rumah Sakit'],
            ],
            'ESTJ' => [
                'name' => 'The Executive (Pengelola Andal & Terstruktur)',
                'summary' => 'Administrator luar biasa, tak tertandingi dalam mengelola berbagai hal atau orang.',
                'majors' => ['Administrasi Publik', 'Manajemen Operasional', 'Ilmu Hukum', 'Teknik Sipil'],
            ],
            'ESFJ' => [
                'name' => 'The Consul (Perhatian, Populer & Sosial)',
                'summary' => 'Sangat peduli, sosial, dan populer, selalu ingin membantu sesama.',
                'majors' => ['Hubungan Masyarakat', 'Manajemen Perhotelan / Pariwisata', 'Pendidikan Guru'],
            ],
            'ISTP' => [
                'name' => 'The Virtuoso (Praktisi Berani & Pengotak-Atik)',
                'summary' => 'Eksperimenter pemberani dan praktis, menguasai semua jenis alat.',
                'majors' => ['Teknik Mesin', 'Teknik Otomotif / Robotika', 'Teknologi Informasi'],
            ],
            'ISFP' => [
                'name' => 'The Adventurer (Seniman Fleksibel & Menawan)',
                'summary' => 'Seniman fleksibel dan menawan, selalu siap menjelajahi dan mengalami hal baru.',
                'majors' => ['Desain Produk / Mode', 'Seni Musik / Teater', 'Arsitektur Lanskap'],
            ],
            'ESTP' => [
                'name' => 'The Entrepreneur (Enerjik, Cerdas & Spontan)',
                'summary' => 'Orang cerdas, energik, dan sangat perseptif, yang benar-benar menikmati hidup dalam tantangan nyata.',
                'majors' => ['Manajemen Bisnis', 'Manajemen Pemasaran', 'Ilmu Keolahragaan', 'Teknik Industri'],
            ],
            'ESFP' => [
                'name' => 'The Entertainer (Spontan, Ramah & Berenergi)',
                'summary' => 'Penghibur spontan, energik, dan antusias - hidup tidak pernah membosankan di dekat mereka.',
                'majors' => ['Seni Pertunjukan', 'Pariwisata & Event Management', 'Ilmu Komunikasi Penyiaran'],
            ],
        ];

        $data = $typesData[$type] ?? [
            'name' => "Tipe MBTI {$type}",
            'summary' => 'Kombinasi kepribadian unik dengan potensi pengembangan diri di lingkungan perkuliahan.',
            'majors' => ['Ilmu Komunikasi', 'Manajemen Bisnis', 'Teknik Informatika'],
        ];

        return [
            'type_name' => $data['name'],
            'summary' => $data['summary'],
            'majors' => $data['majors'],
            'percentages' => $dimensionScores['percentages'] ?? [],
        ];
    }
}

