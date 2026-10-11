<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\MentorBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentoringController extends Controller
{
    public function index(Request $request): Response
    {
        $guru = $request->user();

        if (empty($guru?->npsn)) {
            return Inertia::render('Guru/SesiMentoring', [
                'bookings' => [],
            ]);
        }

        $bookings = MentorBooking::whereHas('student', function ($q) use ($guru) {
                $q->where('npsn', $guru->npsn);
            })
            ->with(['student', 'mentor'])
            ->latest()
            ->get();

        return Inertia::render('Guru/SesiMentoring', [
            'bookings' => $bookings,
        ]);
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $guru = $request->user();
        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
        ]);

        $booking = MentorBooking::whereHas('student', function ($q) use ($guru) {
            $q->where('npsn', $guru?->npsn);
        })->findOrFail($id);

        $booking->update(['status' => $validated['status']]);

        return back()->with('success', 'Status sesi mentoring berhasil diperbarui.');
    }
}
