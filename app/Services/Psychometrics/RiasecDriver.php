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

    public function calculate(array $rowHeaders, array $rowValues, array $config = []): array
    {
        $scores = ['r' => 0, 'i' => 0, 'a' => 0, 's' => 0, 'e' => 0, 'c' => 0];
        $rawAnswers = [];
        $explicitScoresFound = false;

        foreach ($rowHeaders as $idx => $header) {
            $h = strtolower(trim(str_replace(['"', "'", "\xEF\xBB\xBF"], '', $header)));
            $val = trim($rowValues[$idx] ?? '');

            if (in_array($h, ['score_r', 'skor_r', 'r', 'realistic']) && is_numeric($val)) {
                $scores['r'] = (int) $val;
                $explicitScoresFound = true;
            } elseif (in_array($h, ['score_i', 'skor_i', 'i', 'investigative']) && is_numeric($val)) {
                $scores['i'] = (int) $val;
                $explicitScoresFound = true;
            } elseif (in_array($h, ['score_a', 'skor_a', 'a', 'artistic']) && is_numeric($val)) {
                $scores['a'] = (int) $val;
                $explicitScoresFound = true;
            } elseif (in_array($h, ['score_s', 'skor_s', 's', 'social']) && is_numeric($val)) {
                $scores['s'] = (int) $val;
                $explicitScoresFound = true;
            } elseif (in_array($h, ['score_e', 'skor_e', 'e', 'enterprising']) && is_numeric($val)) {
                $scores['e'] = (int) $val;
                $explicitScoresFound = true;
            } elseif (in_array($h, ['score_c', 'skor_c', 'c', 'conventional']) && is_numeric($val)) {
                $scores['c'] = (int) $val;
                $explicitScoresFound = true;
            }

            if (preg_match('/(?:pertanyaan|butir|soal|p)?\s*(\d{1,2})/i', $h, $m)) {
                $num = (int) $m[1];
                $rawAnswers[$num] = $val;
            }
        }

        if (!$explicitScoresFound && !empty($rawAnswers)) {
            foreach ($this->itemMap as $dim => $items) {
                $dimScore = 0;
                foreach ($items as $itemNum) {
                    $ans = strtolower($rawAnswers[$itemNum] ?? '');
                    if ($ans === 'ya' || $ans === 'yes' || $ans === '1' || $ans === 'true' || str_contains($ans, 'sesuai') || str_contains($ans, 'suka')) {
                        $dimScore += 3;
                    } elseif ($ans === 'ragu' || $ans === 'mungkin' || $ans === 'netral' || $ans === 'cukup') {
                        $dimScore += 2;
                    } elseif ($ans !== '' && !str_contains($ans, 'tidak')) {
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

