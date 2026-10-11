<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Mentor;
use App\Models\MentorBooking;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentoringController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user();

        if (empty($student?->npsn)) {
            $mentors = collect();
        } else {
            $gurus = User::where('role', 'guru')
                ->where('npsn', $student->npsn)
                ->get();

            foreach ($gurus as $guru) {
                Mentor::firstOrCreate(
                    ['user_id' => $guru->id],
                    [
                        'name' => $guru->name,
                        'school' => $guru->school ?? 'Sekolah',
                        'expertise' => 'Bimbingan Konseling & Perencanaan Karir',
                    ]
                );
            }

            $mentors = Mentor::whereHas('user', function ($q) use ($student) {
                $q->where('npsn', $student->npsn);
            })->get();
        }

        $myBookings = MentorBooking::with('mentor')
            ->where('student_id', $student->id)
            ->latest()
            ->get();

        return Inertia::render('Student/Booking', [
            'mentors' => $mentors,
            'myBookings' => $myBookings,
            'studentNpsn' => $student?->npsn,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $student = $request->user();

        if (empty($student?->npsn)) {
            return back()->withErrors(['mentor_id' => 'Silakan lengkapi NPSN Sekolah Anda terlebih dahulu sebelum melakukan booking.']);
        }

        $validated = $request->validate([
            'mentor_id' => [
                'required',
                'exists:mentors,id',
                function ($attribute, $value, $fail) use ($student) {
                    $mentor = Mentor::with('user')->find($value);
                    if (!$mentor || !$mentor->user || $mentor->user->npsn !== $student->npsn) {
                        $fail('Anda hanya dapat melakukan booking dengan guru yang memiliki NPSN yang sama dengan sekolah Anda.');
                    }
                },
            ],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'booking_time' => ['required', 'string'],
            'topic' => ['required', 'string', 'max:1000'],
        ]);

        MentorBooking::create([
            'student_id' => $student->id,
            'mentor_id' => $validated['mentor_id'],
            'booking_date' => $validated['booking_date'],
            'booking_time' => $validated['booking_time'],
            'topic' => $validated['topic'],
            'status' => 'pending',
        ]);

        return redirect()->route('student.booking')->with('success', 'Booking mentoring berhasil diajukan.');
    }
}
