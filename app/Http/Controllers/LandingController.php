<?php

namespace App\Http\Controllers;

use App\Models\Major;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        if (Auth::check()) {
            $user = Auth::user();
            return match ($user->role) {
                'admin' => redirect('/admin/dashboard'),
                'guru' => redirect('/guru/dashboard'),
                default => redirect('/student/dashboard'),
            };
        }

        $majors = Major::take(6)->get();

        return Inertia::render('Landing', [
            'majors' => $majors,
        ]);
    }
}
