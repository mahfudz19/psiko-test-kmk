<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\MentorBooking;
use App\Models\RiasecAssessment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $guru = $request->user();
        if (empty($guru?->npsn)) {
            return Inertia::render('Guru/Dashboard', [
                'stats' => [
                    'students' => 0,
                    'tests' => 0,
                    'pendingSessions' => 0,
                ],
            ]);
        }

        $studentIds = User::where('role', 'siswa')->where('npsn', $guru->npsn)->pluck('id');
        $studentsCount = $studentIds->count();
        $testsCount = RiasecAssessment::whereIn('user_id', $studentIds)->count();
        $pendingSessionsCount = MentorBooking::whereIn('student_id', $studentIds)->where('status', 'pending')->count();

        return Inertia::render('Guru/Dashboard', [
            'stats' => [
                'students' => $studentsCount,
                'tests' => $testsCount,
                'pendingSessions' => $pendingSessionsCount,
            ],
        ]);
    }

    public function monitoring(Request $request): Response
    {
        $guru = $request->user();
        if (empty($guru?->npsn)) {
            return Inertia::render('Guru/Monitoring', [
                'students' => [],
                'guruNpsn' => null,
            ]);
        }

        $students = User::where('role', 'siswa')
            ->where('npsn', $guru->npsn)
            ->with(['riasecAssessments' => fn ($q) => $q->latest()])
            ->get()
            ->map(function ($student) {
                $latest = $student->riasecAssessments->first();
                $isCompleted = $latest && $latest->status === 'selesai';
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'npsn' => $student->npsn ?? '-',
                    'school' => $student->school ?? '-',
                    'testStatus' => $isCompleted ? 'Selesai' : 'Belum Selesai',
                    'dominantCode' => $latest?->dominant_code ?? '-',
                    'assessment' => $latest,
                ];
            });

        return Inertia::render('Guru/Monitoring', [
            'students' => $students,
            'guruNpsn' => $guru->npsn,
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
