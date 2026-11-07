<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MentorBooking;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Services\Psychometrics\PsychometricManager;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $manager = new PsychometricManager();
        $tests = PsychometricTest::where('is_active', true)
            ->orderBy('order_num', 'asc')
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->get();
        $totalActiveTests = $tests->count();

        $assessments = RiasecAssessment::where('user_id', $user->id)
            ->where('status', 'selesai')
            ->where(fn ($q) => $q->whereNotNull('dominant_code')->orWhereNotNull('primary_result'))
            ->get();

        $completedCount = $assessments->pluck('psychometric_test_id')->unique()->count();
        $allCompleted = $totalActiveTests > 0 && $completedCount >= $totalActiveTests;

        $completedBadges = [];
        $consolidatedMajors = [];
        $instrumentDetails = [];

        foreach ($tests as $index => $test) {
            $testType = $manager->resolveTypeForTest($test);
            $asm = $assessments->firstWhere('psychometric_test_id', $test->id);
            $isCompleted = !empty($asm);
            $code = $asm?->dominant_code ?? ($asm?->primary_result ?? null);
            $interpretation = $asm?->interpretation ?? [];
            $dimScores = $asm?->dimension_scores ?? [];

            $categoryLabel = match ($testType) {
                'riasec' => 'Minat Vokasional',
                'papi_kostick' => 'Dinamika Kerja',
                'disc' => 'Pola Perilaku',
                'mbti' => 'Tipe Kepribadian',
                default => 'Potensi Diri',
            };

            if ($isCompleted && $code) {
                $completedBadges[] = [
                    'test_id' => $test->id,
                    'test_type' => $testType,
                    'test_name' => $test->name,
                    'code' => $code,
                    'title' => $interpretation['type_name'] ?? $code,
                ];

                if (!empty($interpretation['majors']) && is_array($interpretation['majors'])) {
                    foreach ($interpretation['majors'] as $m) {
                        $consolidatedMajors[] = trim($m);
                    }
                }
            }

            $instrumentDetails[] = [
                'id' => $test->id,
                'name' => $test->name,
                'label' => "Alat Tes " . ($index + 1),
                'test_type' => $testType,
                'category_label' => $categoryLabel,
                'is_completed' => $isCompleted,
                'dominant_code' => $code ?? '-',
                'type_name' => $interpretation['type_name'] ?? ($code ? "Profil {$code}" : null),
                'summary' => $interpretation['summary'] ?? null,
                'dimension_scores' => $dimScores,
                'interpretation' => $interpretation,
                'score_r' => $asm?->score_r ?? ($dimScores['r'] ?? 0),
                'score_i' => $asm?->score_i ?? ($dimScores['i'] ?? 0),
                'score_a' => $asm?->score_a ?? ($dimScores['a'] ?? 0),
                'score_s' => $asm?->score_s ?? ($dimScores['s'] ?? 0),
                'score_e' => $asm?->score_e ?? ($dimScores['e'] ?? 0),
                'score_c' => $asm?->score_c ?? ($dimScores['c'] ?? 0),
            ];
        }

        $consolidatedMajors = array_values(array_unique(array_filter($consolidatedMajors)));
        if (empty($consolidatedMajors)) {
            $consolidatedMajors = ['Teknik Informatika', 'Manajemen Bisnis', 'Ilmu Komunikasi', 'Psikologi', 'Desain Komunikasi Visual'];
        }

        $latestAssessment = $assessments->sortByDesc('updated_at')->first();

        $testStatus = [
            'statusText' => $allCompleted ? 'Selesai' : ($completedCount > 0 ? "Dalam Proses ({$completedCount}/{$totalActiveTests} Tes)" : 'Belum Dikerjakan'),
            'isCompleted' => $allCompleted,
            'completedCount' => $completedCount,
            'totalTests' => $totalActiveTests,
            'hasStarted' => $completedCount > 0,
            'dominantCode' => $latestAssessment?->dominant_code ?? ($latestAssessment?->primary_result ?? null),
            'badges' => $completedBadges,
        ];

        $savedMajorsCount = $user->savedMajors()->count();
        $exploration = [
            'savedCount' => $savedMajorsCount,
            'targetCount' => 5,
            'percentage' => min(100, (int) round(($savedMajorsCount / 5) * 100)),
            'totalMajors' => Major::count(),
        ];

        $upcomingBooking = MentorBooking::with('mentor')
            ->where('student_id', $user->id)
            ->where('booking_date', '>=', now()->toDateString())
            ->whereIn('status', ['confirmed', 'pending'])
            ->orderBy('booking_date')
            ->orderBy('booking_time')
            ->first();

        $mentoring = null;
        if ($upcomingBooking) {
            $date = Carbon::parse($upcomingBooking->booking_date);
            $formattedDate = $date->isToday()
                ? 'Hari ini'
                : ($date->isTomorrow() ? 'Besok' : $date->translatedFormat('d M Y'));

            $mentoring = [
                'mentorName' => $upcomingBooking->mentor?->name ?? 'Mentor Pembimbing',
                'timeString' => "{$formattedDate}, {$upcomingBooking->booking_time} WITA",
                'status' => $upcomingBooking->status,
                'topic' => $upcomingBooking->topic,
            ];
        }

        $riasecAsm = $assessments->first(function ($a) use ($manager, $tests) {
            $t = $tests->firstWhere('id', $a->psychometric_test_id);
            return $t && $manager->resolveTypeForTest($t) === 'riasec';
        }) ?? $latestAssessment;

        $radarScores = [
            'R' => $riasecAsm?->score_r ?? 0,
            'I' => $riasecAsm?->score_i ?? 0,
            'A' => $riasecAsm?->score_a ?? 0,
            'S' => $riasecAsm?->score_s ?? 0,
            'E' => $riasecAsm?->score_e ?? 0,
            'C' => $riasecAsm?->score_c ?? 0,
        ];

        return Inertia::render('Student/Dashboard', [
            'testStatus' => $testStatus,
            'exploration' => $exploration,
            'mentoring' => $mentoring,
            'radarScores' => $radarScores,
            'hasAssessmentScores' => $completedCount > 0,
            'testPortfolios' => $instrumentDetails,
            'consolidatedMajors' => array_slice($consolidatedMajors, 0, 6),
        ]);
    }
}
