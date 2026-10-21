<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MentorBooking;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $tests = PsychometricTest::where('is_active', true)->orderBy('order_num')->get();
        $totalActiveTests = $tests->count();

        $assessments = RiasecAssessment::where('user_id', $user->id)
            ->where('status', 'selesai')
            ->whereNotNull('dominant_code')
            ->get();

        $completedCount = $assessments->pluck('psychometric_test_id')->unique()->count();
        $allCompleted = $totalActiveTests > 0 && $completedCount >= $totalActiveTests;

        $latestAssessment = $assessments->sortByDesc('updated_at')->first()
            ?? RiasecAssessment::where('user_id', $user->id)->latest()->first();

        $topDimensionName = 'Sains & Teknologi';
        if ($latestAssessment && !empty($latestAssessment->dominant_code)) {
            $dimScores = [
                'R' => $latestAssessment->score_r,
                'I' => $latestAssessment->score_i,
                'A' => $latestAssessment->score_a,
                'S' => $latestAssessment->score_s,
                'E' => $latestAssessment->score_e,
                'C' => $latestAssessment->score_c,
            ];
            arsort($dimScores);
            $topKey = array_key_first($dimScores);

            $topDimensionName = match ($topKey) {
                'R' => 'Teknik & Rekayasa',
                'I' => 'Sains & Teknologi',
                'A' => 'Seni & Desain Kreatif',
                'S' => 'Sosial & Pendidikan',
                'E' => 'Bisnis & Manajemen',
                'C' => 'Administrasi & Data',
                default => 'Sains & Teknologi',
            };
        }

        $testStatus = [
            'statusText' => $allCompleted ? 'Selesai' : ($completedCount > 0 ? "Dalam Proses ({$completedCount}/{$totalActiveTests} Tes)" : 'Belum Dikerjakan'),
            'isCompleted' => $allCompleted,
            'completedCount' => $completedCount,
            'totalTests' => $totalActiveTests,
            'hasStarted' => $completedCount > 0,
            'dominantCode' => $latestAssessment?->dominant_code ?? null,
            'topDimension' => $topDimensionName,
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

        $radarScores = [
            'R' => $latestAssessment?->score_r ?? 0,
            'I' => $latestAssessment?->score_i ?? 0,
            'A' => $latestAssessment?->score_a ?? 0,
            'S' => $latestAssessment?->score_s ?? 0,
            'E' => $latestAssessment?->score_e ?? 0,
            'C' => $latestAssessment?->score_c ?? 0,
        ];

        $hasAssessmentScores = !empty($latestAssessment?->dominant_code);

        $testComparisons = $tests->map(function ($test, $index) use ($assessments) {
            $asm = $assessments->firstWhere('psychometric_test_id', $test->id);
            $scoreR = $asm?->score_r ?? 0;
            $scoreI = $asm?->score_i ?? 0;
            $scoreA = $asm?->score_a ?? 0;
            $scoreS = $asm?->score_s ?? 0;
            $scoreE = $asm?->score_e ?? 0;
            $scoreC = $asm?->score_c ?? 0;
            $totalScore = $scoreR + $scoreI + $scoreA + $scoreS + $scoreE + $scoreC;
            $maxPossible = 28 * 6;
            $avgScore = $asm ? round($totalScore / 6, 1) : 0;
            $heightPct = $asm ? min(100, max(15, (int) round(($totalScore / $maxPossible) * 100))) : 8;

            return [
                'id' => $test->id,
                'name' => $test->name,
                'label' => "Alat Tes " . ($index + 1),
                'is_completed' => !empty($asm),
                'dominant_code' => $asm?->dominant_code ?? '-',
                'totalScore' => $totalScore,
                'avgScore' => $avgScore,
                'height' => "{$heightPct}%",
                'scores' => [
                    'R' => $scoreR,
                    'I' => $scoreI,
                    'A' => $scoreA,
                    'S' => $scoreS,
                    'E' => $scoreE,
                    'C' => $scoreC,
                ],
            ];
        })->values()->all();

        return Inertia::render('Student/Dashboard', [
            'testStatus' => $testStatus,
            'exploration' => $exploration,
            'mentoring' => $mentoring,
            'radarScores' => $radarScores,
            'hasAssessmentScores' => $hasAssessmentScores,
            'testComparisons' => $testComparisons,
        ]);
    }
}
