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
        $tests = PsychometricTest::where('is_active', true)->orderBy('order_num')->get();
        $student = $request->user();
        if (!empty($student?->npsn)) {
            $mentors = Mentor::whereHas('user', function ($q) use ($student) {
                $q->where('npsn', $student->npsn);
            })->get();
        } else {
            $mentors = Mentor::all();
        }
        $latestAssessment = RiasecAssessment::where('user_id', $request->user()->id)
            ->where('status', 'selesai')
            ->latest()
            ->first();

        return Inertia::render('Student/Riasec', [
            'tests' => $tests,
            'mentors' => $mentors,
            'previousResult' => $latestAssessment,
        ]);
    }

    public function start(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_id' => ['required'],
            'mentor_name' => ['nullable', 'string', 'max:255'],
            'class_name' => ['nullable', 'string', 'max:255'],
            'attendance_number' => ['nullable', 'string', 'max:255'],
        ]);

        RiasecAssessment::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'status' => 'mengerjakan',
            ],
            [
                'psychometric_test_id' => $validated['test_id'],
                'mentor_name' => $validated['mentor_name'] ?? 'Bpk. Budi Santoso, M.Psi',
                'class_name' => $validated['class_name'] ?? 'XI IPA 2',
                'attendance_number' => $validated['attendance_number'] ?? '12',
            ]
        );

        return back()->with('success', 'Asesmen dimulai.');
    }

    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();
        $testId = $request->input('test_id');

        $assessment = RiasecAssessment::where('user_id', $user->id)
            ->where('status', 'mengerjakan')
            ->latest()
            ->first();

        $scores = [
            'R' => 22,
            'S' => 22,
            'I' => 21,
            'E' => 21,
            'A' => 20,
            'C' => 20,
        ];

        if ($assessment) {
            $assessment->update([
                'score_r' => $scores['R'],
                'score_i' => $scores['I'],
                'score_a' => $scores['A'],
                'score_s' => $scores['S'],
                'score_e' => $scores['E'],
                'score_c' => $scores['C'],
                'dominant_code' => 'RSI',
                'status' => 'selesai',
            ]);
        } else {
            RiasecAssessment::create([
                'user_id' => $user->id,
                'psychometric_test_id' => $testId,
                'score_r' => $scores['R'],
                'score_i' => $scores['I'],
                'score_a' => $scores['A'],
                'score_s' => $scores['S'],
                'score_e' => $scores['E'],
                'score_c' => $scores['C'],
                'dominant_code' => 'RSI',
                'mentor_name' => $request->input('mentor_name', 'Bpk. Budi Santoso, M.Psi'),
                'class_name' => $request->input('class_name', 'XI IPA 2'),
                'attendance_number' => $request->input('attendance_number', '12'),
                'status' => 'selesai',
            ]);
        }

        return back()->with('success', 'Asesmen berhasil diselesaikan.');
    }

    public function reset(Request $request): RedirectResponse
    {
        RiasecAssessment::where('user_id', $request->user()->id)->delete();

        return back()->with('success', 'Asesmen berhasil direset.');
    }
}
