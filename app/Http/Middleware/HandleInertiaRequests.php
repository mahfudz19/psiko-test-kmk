<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'registration_id' => $request->user()->registration_id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'personal_email' => $request->user()->personal_email,
                    'role' => $request->user()->role,
                    'school' => $request->user()->school,
                    'phone' => $request->user()->phone,
                    'npsn' => $request->user()->npsn,
                    'status' => $request->user()->status,
                    'avatar' => $request->user()->avatar,
                    'has_reviewed' => \App\Models\Testimonial::where('user_id', $request->user()->id)->exists(),
                ] : null,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
        ];
    }
}
