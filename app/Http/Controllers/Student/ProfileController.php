<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mentor;
use App\Models\RiasecAssessment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

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

        $latestAssessment = RiasecAssessment::where('user_id', $user->id)
            ->whereNotNull('mentor_name')
            ->latest('updated_at')
            ->first();

        $currentMentor = $user->selected_mentor ?? ($latestAssessment?->mentor_name ?? ($mentors->first()?->name ?? ''));

        return Inertia::render('Student/Profile', [
            'user' => $user,
            'mentors' => $mentors,
            'currentMentor' => $currentMentor,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'school' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'npsn' => ['sometimes', 'nullable', 'string', 'max:50'],
            'mentor_name' => ['sometimes', 'nullable', 'string', 'max:255'],
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
        if (array_key_exists('mentor_name', $validated)) {
            $chosenMentor = trim($validated['mentor_name'] ?? '');
            if (!empty($chosenMentor)) {
                $user->selected_mentor = $chosenMentor;
                RiasecAssessment::where('user_id', $user->id)->update([
                    'mentor_name' => $chosenMentor,
                ]);
            }
        }

        $user->save();

        return back()->with('success', 'Profil dan informasi akun berhasil diperbarui.');
    }
}
