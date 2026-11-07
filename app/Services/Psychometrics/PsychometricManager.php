<?php

namespace App\Services\Psychometrics;

use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Models\User;

class PsychometricManager
{
    private array $drivers = [];

    public function __construct()
    {
        $this->drivers = [
            'riasec' => new RiasecDriver(),
            'papi_kostick' => new PapiKostickDriver(),
            'disc' => new DiscDriver(),
            'mbti' => new MbtiDriver(),
        ];
    }

    public function getDriver(string $type): ScoringDriverInterface
    {
        $normalizedType = strtolower(trim($type));
        return $this->drivers[$normalizedType] ?? $this->drivers['riasec'];
    }

    public function resolveTypeForTest(PsychometricTest $test): string
    {
        if (!empty($test->test_type) && isset($this->drivers[$test->test_type])) {
            return $test->test_type;
        }

        $name = strtolower($test->name);
        if (str_contains($name, 'papi')) {
            return 'papi_kostick';
        }
        if (str_contains($name, 'disc')) {
            return 'disc';
        }
        if (str_contains($name, 'mbti')) {
            return 'mbti';
        }

        return 'riasec';
    }

    public function updateStudentAssessment(User $student, int $testId, array $data): RiasecAssessment
    {
        $test = PsychometricTest::find($testId);
        $testType = $test ? $this->resolveTypeForTest($test) : ($data['test_type'] ?? 'riasec');
        $existingAssessment = RiasecAssessment::where('user_id', $student->id)
            ->where('psychometric_test_id', $testId)
            ->first();

        $mentorName = !empty($data['mentor_name'])
            ? $data['mentor_name']
            : ($existingAssessment?->mentor_name ?? 'Bpk. Budi Santoso, M.Psi');

        $customMajors = null;
        if (isset($data['majors']) && is_array($data['majors'])) {
            $customMajors = array_values(array_filter(array_map('trim', $data['majors'])));
        }

        if ($testType === 'papi_kostick') {
            $scores = $data['dimension_scores'] ?? ($existingAssessment?->dimension_scores ?? []);
            if (!is_array($scores)) {
                $scores = [];
            }
            $aspectKeys = ['G', 'L', 'I', 'T', 'V', 'S', 'R', 'D', 'C', 'E', 'N', 'A', 'P', 'X', 'B', 'O', 'Z', 'K', 'F', 'W'];
            $cleanScores = [];
            foreach ($aspectKeys as $k) {
                $cleanScores[$k] = isset($scores[$k]) ? max(0, min(9, (int) $scores[$k])) : 0;
            }

            /** @var PapiKostickDriver $driver */
            $driver = $this->getDriver('papi_kostick');
            $interpretation = $driver->generateRecommendations($cleanScores);
            if ($customMajors !== null) {
                $interpretation['majors'] = $customMajors;
            } elseif (!empty($existingAssessment?->interpretation['majors']) && !isset($data['dimension_scores'])) {
                $interpretation['majors'] = $existingAssessment->interpretation['majors'];
            }
            $topAspects = $interpretation['top_aspects'] ?? [];
            $dominantCode = implode('', array_slice(array_column($topAspects, 'code'), 0, 3));

            return RiasecAssessment::updateOrCreate(
                [
                    'user_id' => $student->id,
                    'psychometric_test_id' => $testId,
                ],
                [
                    'test_type' => 'papi_kostick',
                    'primary_result' => $dominantCode,
                    'dominant_code' => $dominantCode,
                    'dimension_scores' => $cleanScores,
                    'interpretation' => $interpretation,
                    'mentor_name' => $mentorName,
                    'status' => 'selesai',
                    'completed_at' => $existingAssessment?->completed_at ?? now(),
                ]
            );
        }

        if ($testType === 'disc') {
            $dimScores = $data['dimension_scores'] ?? ($existingAssessment?->dimension_scores ?? []);
            $most = $dimScores['graph1_most'] ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];
            $least = $dimScores['graph2_least'] ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];
            $diff = $dimScores['graph3_diff'] ?? [
                'D' => ($most['D'] ?? 0) - ($least['D'] ?? 0),
                'I' => ($most['I'] ?? 0) - ($least['I'] ?? 0),
                'S' => ($most['S'] ?? 0) - ($least['S'] ?? 0),
                'C' => ($most['C'] ?? 0) - ($least['C'] ?? 0),
            ];

            $profileCode = $data['primary_result'] ?? ($existingAssessment?->primary_result ?? null);
            if (empty($profileCode)) {
                $sortedDiff = $diff;
                arsort($sortedDiff);
                $topDim = array_key_first($sortedDiff);
                $secondDim = array_keys($sortedDiff)[1] ?? '';
                $profileCode = ($sortedDiff[$secondDim] ?? 0) > 0 ? "{$topDim}{$secondDim}" : $topDim;
            }

            /** @var DiscDriver $discDriver */
            $discDriver = $this->getDriver('disc');
            $fullDimScores = [
                'graph1_most' => $most,
                'graph2_least' => $least,
                'graph3_diff' => $diff,
                'd' => $diff['D'] ?? 0,
                'i' => $diff['I'] ?? 0,
                's' => $diff['S'] ?? 0,
                'c' => $diff['C'] ?? 0,
            ];
            $interpretation = $discDriver->generateRecommendations($fullDimScores, $profileCode);
            if ($customMajors !== null) {
                $interpretation['majors'] = $customMajors;
            } elseif (!empty($existingAssessment?->interpretation['majors']) && !isset($data['dimension_scores'])) {
                $interpretation['majors'] = $existingAssessment->interpretation['majors'];
            }

            return RiasecAssessment::updateOrCreate(
                [
                    'user_id' => $student->id,
                    'psychometric_test_id' => $testId,
                ],
                [
                    'test_type' => 'disc',
                    'primary_result' => $profileCode,
                    'dominant_code' => $profileCode,
                    'dimension_scores' => $fullDimScores,
                    'interpretation' => $interpretation,
                    'mentor_name' => $mentorName,
                    'status' => 'selesai',
                    'completed_at' => $existingAssessment?->completed_at ?? now(),
                ]
            );
        }

        if ($testType === 'mbti') {
            $mbtiType = strtoupper(trim($data['primary_result'] ?? ($existingAssessment?->primary_result ?? 'ENFJ')));
            $percentages = $data['dimension_scores']['percentages'] ?? ($data['percentages'] ?? ($existingAssessment?->dimension_scores['percentages'] ?? []));
            if (empty($percentages)) {
                $percentages = [
                    'E' => str_contains($mbtiType, 'E') ? 65 : 35,
                    'I' => str_contains($mbtiType, 'I') ? 65 : 35,
                    'S' => str_contains($mbtiType, 'S') ? 65 : 35,
                    'N' => str_contains($mbtiType, 'N') ? 65 : 35,
                    'T' => str_contains($mbtiType, 'T') ? 65 : 35,
                    'F' => str_contains($mbtiType, 'F') ? 65 : 35,
                    'J' => str_contains($mbtiType, 'J') ? 65 : 35,
                    'P' => str_contains($mbtiType, 'P') ? 65 : 35,
                ];
            }

            /** @var MbtiDriver $mbtiDriver */
            $mbtiDriver = $this->getDriver('mbti');
            $fullDimScores = [
                'type' => $mbtiType,
                'percentages' => $percentages,
            ];
            $interpretation = $mbtiDriver->generateRecommendations($fullDimScores, $mbtiType);
            if ($customMajors !== null) {
                $interpretation['majors'] = $customMajors;
            } elseif (!empty($existingAssessment?->interpretation['majors']) && !isset($data['primary_result']) && !isset($data['percentages'])) {
                $interpretation['majors'] = $existingAssessment->interpretation['majors'];
            }

            return RiasecAssessment::updateOrCreate(
                [
                    'user_id' => $student->id,
                    'psychometric_test_id' => $testId,
                ],
                [
                    'test_type' => 'mbti',
                    'primary_result' => $mbtiType,
                    'dominant_code' => $mbtiType,
                    'dimension_scores' => $fullDimScores,
                    'interpretation' => $interpretation,
                    'mentor_name' => $mentorName,
                    'status' => 'selesai',
                    'completed_at' => $existingAssessment?->completed_at ?? now(),
                ]
            );
        }

        $scoreR = (int) ($data['score_r'] ?? ($existingAssessment?->score_r ?? 15));
        $scoreI = (int) ($data['score_i'] ?? ($existingAssessment?->score_i ?? 22));
        $scoreA = (int) ($data['score_a'] ?? ($existingAssessment?->score_a ?? 24));
        $scoreS = (int) ($data['score_s'] ?? ($existingAssessment?->score_s ?? 26));
        $scoreE = (int) ($data['score_e'] ?? ($existingAssessment?->score_e ?? 20));
        $scoreC = (int) ($data['score_c'] ?? ($existingAssessment?->score_c ?? 17));

        $dominantCode = $data['dominant_code'] ?? ($existingAssessment?->dominant_code ?? null);
        if (empty($dominantCode)) {
            $dims = ['R' => $scoreR, 'I' => $scoreI, 'A' => $scoreA, 'S' => $scoreS, 'E' => $scoreE, 'C' => $scoreC];
            arsort($dims);
            $dominantCode = implode('', array_slice(array_keys($dims), 0, 3));
        }

        $answers = is_array($existingAssessment?->answers) ? $existingAssessment->answers : [];
        if (isset($data['dimension_customizations'])) {
            $answers['dimensions'] = $data['dimension_customizations'];
        }

        /** @var RiasecDriver $riasecDriver */
        $riasecDriver = $this->getDriver('riasec');
        $dimensionScores = ['r' => $scoreR, 'i' => $scoreI, 'a' => $scoreA, 's' => $scoreS, 'e' => $scoreE, 'c' => $scoreC];
        $interpretation = $riasecDriver->generateRecommendations($dimensionScores, $dominantCode);
        if ($customMajors !== null) {
            $interpretation['majors'] = $customMajors;
        } elseif (!empty($existingAssessment?->interpretation['majors']) && !isset($data['score_r'])) {
            $interpretation['majors'] = $existingAssessment->interpretation['majors'];
        }

        return RiasecAssessment::updateOrCreate(
            [
                'user_id' => $student->id,
                'psychometric_test_id' => $testId,
            ],
            [
                'test_type' => 'riasec',
                'score_r' => $scoreR,
                'score_i' => $scoreI,
                'score_a' => $scoreA,
                'score_s' => $scoreS,
                'score_e' => $scoreE,
                'score_c' => $scoreC,
                'dominant_code' => strtoupper($dominantCode),
                'primary_result' => strtoupper($dominantCode),
                'dimension_scores' => $dimensionScores,
                'interpretation' => $interpretation,
                'mentor_name' => $mentorName,
                'status' => 'selesai',
                'answers' => !empty($answers) ? $answers : null,
                'completed_at' => $existingAssessment?->completed_at ?? now(),
            ]
        );
    }
}
