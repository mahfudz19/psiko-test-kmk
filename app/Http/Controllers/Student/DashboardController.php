<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MentorBooking;
use App\Models\RiasecAssessment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $latestAssessment = RiasecAssessment::where('user_id', $user->id)->latest()->first();
        $bookingsCount = MentorBooking::where('student_id', $user->id)->count();
        $majorsCount = Major::count();

        return Inertia::render('Student/Dashboard', [
            'latestAssessment' => $latestAssessment,
            'bookingsCount' => $bookingsCount,
            'majorsCount' => $majorsCount,
        ]);
    }
}
