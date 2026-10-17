<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\MentorBooking;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $guru = $request->user();
        $hasNpsn = !empty($guru?->npsn);

        if (!$hasNpsn) {
            return Inertia::render('Guru/Dashboard', [
                'hasNpsn' => false,
                'stats' => [
                    'students' => 0,
                    'tests' => 0,
                    'pendingSessions' => 0,
                    'schoolName' => $guru?->school ?? '-',
                    'npsn' => '-',
                ],
                'activities' => [],
                'upcomingSessions' => [],
            ]);
        }

        $studentIds = User::where('role', 'siswa')->where('npsn', $guru->npsn)->pluck('id');
        $studentsCount = $studentIds->count();
        $completedTestsCount = RiasecAssessment::whereIn('user_id', $studentIds)->where('status', 'selesai')->count();
        $pendingSessionsCount = MentorBooking::whereHas('student', function ($q) use ($guru) {
            $q->where('npsn', $guru->npsn);
        })->where('status', 'pending')->count();

        $upcomingSessions = MentorBooking::whereHas('student', function ($q) use ($guru) {
                $q->where('npsn', $guru->npsn);
            })
            ->with(['student', 'mentor'])
            ->where('booking_date', '>=', now()->toDateString())
            ->whereIn('status', ['approved', 'pending'])
            ->orderBy('booking_date')
            ->orderBy('booking_time')
            ->take(4)
            ->get()
            ->map(function ($b) {
                $date = Carbon::parse($b->booking_date);
                $formattedDate = $date->isToday()
                    ? 'Hari ini'
                    : ($date->isTomorrow() ? 'Besok' : $date->translatedFormat('d M Y'));

                return [
                    'id' => $b->id,
                    'student_name' => $b->student?->name ?? 'Siswa',
                    'mentor_name' => $b->mentor?->name ?? 'Mentor',
                    'time_string' => "{$formattedDate}, {$b->booking_time} WITA",
                    'topic' => $b->topic ?? 'Konsultasi Bimbingan Karier',
                    'status' => $b->status,
                ];
            });

        $testActivities = RiasecAssessment::whereIn('user_id', $studentIds)
            ->where('status', 'selesai')
            ->with('user')
            ->latest('updated_at')
            ->take(4)
            ->get()
            ->map(function ($a) {
                return [
                    'timestamp' => $a->updated_at?->timestamp ?? 0,
                    'text' => ($a->user?->name ?? 'Siswa') . ' menyelesaikan Tes Minat Bakat (Kode: ' . ($a->dominant_code ?? '-') . ')',
                    'time' => $a->updated_at?->diffForHumans() ?? '-',
                    'type' => 'test',
                    'href' => '/guru/monitoring',
                ];
            });

        $bookingActivities = MentorBooking::whereHas('student', function ($q) use ($guru) {
                $q->where('npsn', $guru->npsn);
            })
            ->with('student')
            ->latest('created_at')
            ->take(4)
            ->get()
            ->map(function ($b) {
                return [
                    'timestamp' => $b->created_at?->timestamp ?? 0,
                    'text' => ($b->student?->name ?? 'Siswa') . ' mengajukan sesi mentoring konsultasi karier',
                    'time' => $b->created_at?->diffForHumans() ?? '-',
                    'type' => 'mentoring',
                    'href' => '/guru/sesi-mentoring',
                ];
            });

        $studentActivities = User::where('role', 'siswa')
            ->where('npsn', $guru->npsn)
            ->latest('created_at')
            ->take(4)
            ->get()
            ->map(function ($u) {
                return [
                    'timestamp' => $u->created_at?->timestamp ?? 0,
                    'text' => $u->name . ' terdaftar sebagai siswa baru',
                    'time' => $u->created_at?->diffForHumans() ?? '-',
                    'type' => 'student',
                    'href' => '/guru/monitoring',
                ];
            });

        $allActivities = $testActivities->concat($bookingActivities)->concat($studentActivities)
            ->sortByDesc('timestamp')
            ->take(6)
            ->values()
            ->all();

        return Inertia::render('Guru/Dashboard', [
            'hasNpsn' => true,
            'stats' => [
                'students' => $studentsCount,
                'tests' => $completedTestsCount,
                'pendingSessions' => $pendingSessionsCount,
                'schoolName' => $guru->school ?? '-',
                'npsn' => $guru->npsn,
            ],
            'activities' => $allActivities,
            'upcomingSessions' => $upcomingSessions,
        ]);
    }

    public function monitoring(Request $request): Response
    {
        $guru = $request->user();
        if (empty($guru?->npsn)) {
            return Inertia::render('Guru/Monitoring', [
                'students' => [],
                'guruNpsn' => null,
                'tests' => [],
            ]);
        }

        $tests = PsychometricTest::where('is_active', true)->orderBy('order_num')->get();
        $totalActiveTests = $tests->count();

        $students = User::where('role', 'siswa')
            ->where('npsn', $guru->npsn)
            ->with(['riasecAssessments' => fn ($q) => $q->latest()])
            ->get()
            ->map(function ($student) use ($tests, $totalActiveTests) {
                $assessments = $student->riasecAssessments;
                $completedAssessments = $assessments->where('status', 'selesai')->filter(fn ($a) => !empty($a->dominant_code));
                $completedTestIds = $completedAssessments->pluck('psychometric_test_id')->unique()->toArray();
                $completedCount = count($completedTestIds);
                $allCompleted = $totalActiveTests > 0 && $completedCount >= $totalActiveTests;
                $activeAssessment = $completedAssessments->first() ?? $assessments->first();

                $importedTests = $tests->map(function ($t) use ($completedTestIds) {
                    return [
                        'id' => $t->id,
                        'name' => $t->name,
                        'is_imported' => in_array($t->id, $completedTestIds),
                    ];
                })->values()->all();

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'npsn' => $student->npsn ?? '-',
                    'school' => $student->school ?? '-',
                    'testStatus' => $allCompleted ? 'Selesai' : ($completedCount > 0 ? "Belum Selesai ({$completedCount}/{$totalActiveTests})" : 'Belum Selesai'),
                    'isCompleted' => $allCompleted,
                    'completedCount' => $completedCount,
                    'totalTests' => $totalActiveTests,
                    'importedCount' => $completedCount,
                    'imported_tests' => $importedTests,
                    'dominantCode' => $activeAssessment?->dominant_code ?? '-',
                    'mentor_name' => $activeAssessment?->mentor_name ?? 'Bpk. Budi Santoso, M.Psi',
                    'assessment' => $activeAssessment,
                    'assessments' => $completedAssessments->values()->all(),
                ];
            });

        return Inertia::render('Guru/Monitoring', [
            'students' => $students,
            'guruNpsn' => $guru->npsn,
            'tests' => $tests,
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('Guru/Profile', [
            'user' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'school' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'npsn' => ['sometimes', 'nullable', 'string', 'max:50'],
            'current_password' => ['nullable', 'string'],
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'new_password.min' => 'Password baru minimal 6 karakter.',
            'new_password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        if (!empty($validated['new_password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Password saat ini tidak sesuai.']);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        if (array_key_exists('name', $validated)) {
            $user->name = trim($validated['name']);
        }
        if (array_key_exists('school', $validated)) {
            $user->school = trim($validated['school'] ?? '');
        }
        if (array_key_exists('phone', $validated)) {
            $user->phone = trim($validated['phone'] ?? '');
        }
        if (array_key_exists('npsn', $validated)) {
            $user->npsn = trim($validated['npsn'] ?? '');
        }

        $user->save();

        return back()->with('success', 'Profil dan informasi akun berhasil diperbarui.');
    }
}
