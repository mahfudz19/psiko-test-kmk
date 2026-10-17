<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mentor;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiasecController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $tests = PsychometricTest::where('is_active', true)->orderBy('order_num')->get();

        if (!empty($user?->npsn)) {
            $mentors = Mentor::whereHas('user', function ($q) use ($user) {
                $q->where('npsn', $user->npsn);
            })->get();
        } else {
            $mentors = Mentor::all();
        }

        $assessments = RiasecAssessment::where('user_id', $user->id)->get();
        $hasStarted = $assessments->isNotEmpty();

        $completedTestIds = $assessments->where('status', 'selesai')->pluck('psychometric_test_id')->toArray();
        $inProgressTestIds = $assessments->where('status', 'mengerjakan')->pluck('psychometric_test_id')->toArray();

        $testsWithStatus = $tests->map(function ($test) use ($completedTestIds, $inProgressTestIds) {
            $data = $test->toArray();
            $data['is_completed'] = in_array($test->id, $completedTestIds);
            $data['is_in_progress'] = in_array($test->id, $inProgressTestIds);
            return $data;
        });

        $totalTests = $tests->count();
        $completedCount = count($completedTestIds);
        $allCompleted = $totalTests > 0 && $completedCount >= $totalTests;

        $latestAssessment = $assessments->where('status', 'selesai')->sortByDesc('updated_at')->first()
            ?? $assessments->sortByDesc('updated_at')->first();

        $completedAssessments = $assessments->where('status', 'selesai')->values()->all();

        $hasScores = !empty($latestAssessment?->dominant_code);

        return Inertia::render('Student/Riasec', [
            'tests' => $testsWithStatus,
            'mentors' => $mentors,
            'hasStarted' => $hasStarted,
            'allCompleted' => $allCompleted,
            'completedCount' => $completedCount,
            'hasScores' => $hasScores,
            'assessment' => $latestAssessment,
            'assessments' => $completedAssessments,
        ]);
    }

    public function start(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_id' => ['required'],
            'mentor_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        RiasecAssessment::updateOrCreate(
            [
                'user_id' => $user->id,
                'psychometric_test_id' => $validated['test_id'],
            ],
            [
                'status' => 'mengerjakan',
                'mentor_name' => $validated['mentor_name'] ?? 'Bpk. Budi Santoso, M.Psi',
            ]
        );

        return back()->with('success', 'Asesmen dimulai.');
    }

    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();
        $testId = $request->input('test_id');

        $assessment = RiasecAssessment::where('user_id', $user->id)
            ->where('psychometric_test_id', $testId)
            ->first();

        if ($assessment) {
            $assessment->update([
                'status' => 'selesai',
            ]);
        } else {
            RiasecAssessment::create([
                'user_id' => $user->id,
                'psychometric_test_id' => $testId,
                'status' => 'selesai',
                'mentor_name' => $request->input('mentor_name', 'Bpk. Budi Santoso, M.Psi'),
            ]);
        }

        return back()->with('success', 'Tes berhasil diselesaikan.');
    }

    public function reset(Request $request): RedirectResponse
    {
        RiasecAssessment::where('user_id', $request->user()->id)->delete();

        return back()->with('success', 'Asesmen berhasil direset.');
    }
}
