<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mentor;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Models\User;
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
            $gurus = User::where('role', 'guru')
                ->where('npsn', $user->npsn)
                ->get();

            foreach ($gurus as $guru) {
                Mentor::firstOrCreate(
                    ['user_id' => $guru->id],
                    [
                        'name' => $guru->name,
                        'school' => $guru->school ?? ($user->school ?? 'Sekolah'),
                        'expertise' => 'Bimbingan Konseling & Perencanaan Karir',
                    ]
                );
            }

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

        $testsWithStatus = $tests->map(function ($test, $index) use ($completedTestIds, $inProgressTestIds, $tests, $assessments) {
            $data = $test->toArray();
            $data['is_completed'] = in_array($test->id, $completedTestIds);
            $data['is_in_progress'] = in_array($test->id, $inProgressTestIds);

            $asm = $assessments->firstWhere('psychometric_test_id', $test->id);
            $data['has_score'] = !empty($asm?->dominant_code) || $asm?->score_r !== null;
            $data['dominant_code'] = $asm?->dominant_code ?? null;

            $isLocked = false;
            if ($index > 0) {
                for ($i = 0; $i < $index; $i++) {
                    if (!in_array($tests[$i]->id, $completedTestIds)) {
                        $isLocked = true;
                        break;
                    }
                }
            }
            $data['is_locked'] = $isLocked;
            return $data;
        });

        $totalTests = $tests->count();
        $completedCount = count($completedTestIds);
        $allCompleted = $totalTests > 0 && $completedCount >= $totalTests;

        $assessmentWithScores = $assessments->where('status', 'selesai')
            ->filter(fn($a) => !empty($a->dominant_code) || $a->score_r !== null)
            ->sortByDesc('updated_at')
            ->first();

        $latestAssessment = $assessmentWithScores
            ?? $assessments->where('status', 'selesai')->sortByDesc('updated_at')->first()
            ?? $assessments->sortByDesc('updated_at')->first();

        $completedAssessments = $assessments->where('status', 'selesai')->values()->all();

        $hasScores = $assessments->contains(fn($a) => !empty($a->dominant_code) || $a->score_r !== null);

        $selectedMentor = $latestAssessment?->mentor_name ?? ($user->selected_mentor ?? ($mentors->first()?->name ?? 'Bpk. Budi Santoso, M.Psi'));

        return Inertia::render('Student/Riasec', [
            'tests' => $testsWithStatus,
            'mentors' => $mentors,
            'selectedMentor' => $selectedMentor,
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

        $currentTest = PsychometricTest::find($validated['test_id']);
        if ($currentTest) {
            $priorUnfinished = PsychometricTest::where('is_active', true)
                ->where('order_num', '<', $currentTest->order_num)
                ->whereDoesntHave('assessments', function ($q) use ($user) {
                    $q->where('user_id', $user->id)->where('status', 'selesai');
                })
                ->exists();

            if ($priorUnfinished) {
                return back()->withErrors(['test_id' => 'Harap selesaikan instrumen tes sebelumnya terlebih dahulu.']);
            }
        }

        $chosenMentor = $validated['mentor_name'] ?? ($user->selected_mentor ?? 'Bpk. Budi Santoso, M.Psi');

        if (!empty($chosenMentor)) {
            $user->update(['selected_mentor' => $chosenMentor]);
        }

        RiasecAssessment::updateOrCreate(
            [
                'user_id' => $user->id,
                'psychometric_test_id' => $validated['test_id'],
            ],
            [
                'status' => 'mengerjakan',
                'mentor_name' => $chosenMentor,
            ]
        );

        return back()->with('success', 'Asesmen dimulai.');
    }

    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();
        $testId = $request->input('test_id');
        $chosenMentor = $request->input('mentor_name') ?? ($user->selected_mentor ?? 'Bpk. Budi Santoso, M.Psi');

        $assessment = RiasecAssessment::where('user_id', $user->id)
            ->where('psychometric_test_id', $testId)
            ->first();

        if ($assessment) {
            $assessment->update([
                'status' => 'selesai',
                'mentor_name' => $assessment->mentor_name ?: $chosenMentor,
            ]);
        } else {
            RiasecAssessment::create([
                'user_id' => $user->id,
                'psychometric_test_id' => $testId,
                'status' => 'selesai',
                'mentor_name' => $chosenMentor,
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
