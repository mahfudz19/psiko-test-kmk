<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return match (Auth::user()->role) {
                'admin' => redirect('/admin/dashboard'),
                'guru' => redirect('/guru/dashboard'),
                default => redirect('/student/dashboard'),
            };
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $inputEmail = strtolower(trim($credentials['email']));

        $user = User::where('email', $inputEmail)
            ->orWhere('registration_id', $inputEmail)
            ->orWhere('personal_email', $inputEmail)
            ->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Email atau password yang Anda masukkan salah.',
            ]);
        }

        if ($user->status === 'pending') {
            return back()->withErrors([
                'email' => 'Akun Anda masih dalam status Menunggu Persetujuan oleh Administrator.',
            ]);
        }

        if (empty($user->password) || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'email' => 'Email atau password yang Anda masukkan salah.',
            ]);
        }

        if ($user->status === 'banned') {
            return back()->withErrors([
                'email' => 'Akun Anda dinonaktifkan oleh administrator.',
            ]);
        }

        if ($user->status !== 'active') {
            return back()->withErrors([
                'email' => 'Akun Anda belum aktif. Silakan hubungi admin.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return match ($user->role) {
            'admin' => redirect()->intended('/admin/dashboard'),
            'guru' => redirect()->intended('/guru/dashboard'),
            default => redirect()->intended('/student/dashboard'),
        };
    }

    public function redirectToGoogle(Request $request): RedirectResponse
    {
        $hd = $request->query('hd') ?: config('services.google.hd', 'gen.univeral.ac.id');

        return Socialite::driver('google')
            ->with([
                'hd' => $hd,
                'prompt' => 'select_account',
            ])
            ->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Gagal menghubungkan ke akun Google. Silakan coba kembali.',
            ]);
        }

        $email = strtolower(trim($googleUser->getEmail()));
        $domain = substr(strrchr($email, '@'), 1);

        $allowedDomains = [
            'gen.univeral.ac.id',
            'abpptsisulsel.id',
            'iluniveral.id',
            'khazanahmk.id',
            'member.abpptsisulsel.id',
            'student.univeral.ac.id',
            'unveral.ac.id',
            'univeral.ac.id',
            'inbitef.ac.id',
        ];

        $isAllowed = in_array($domain, $allowedDomains, true) ||
            str_ends_with($domain, '.univeral.ac.id') ||
            str_ends_with($domain, '.abpptsisulsel.id');

        if (!$isAllowed) {
            return redirect()->route('login')->withErrors([
                'email' => "Akses ditolak. Domain @{$domain} tidak diizinkan. Hanya email dari domain resmi yang dikelola oleh univeral.ac.id yang dapat digunakan untuk login.",
            ]);
        }

        $user = User::where('email', $email)
            ->orWhere('personal_email', $email)
            ->orWhere('google_id', $googleUser->getId())
            ->first();

        if (!$user) {
            return redirect()->route('login')->withErrors([
                'email' => "Akun Google Workspace {$email} belum terdaftar di sistem Gen-U. Silakan mendaftar terlebih dahulu atau hubungi Administrator.",
            ]);
        }

        if ($user->status === 'pending') {
            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda masih dalam antrean persetujuan oleh Administrator.',
            ]);
        }

        if ($user->status === 'banned') {
            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda dinonaktifkan oleh Administrator.',
            ]);
        }

        if ($user->status !== 'active') {
            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda dinonaktifkan atau belum aktif. Silakan hubungi Administrator.',
            ]);
        }

        $user->update(['google_id' => $googleUser->getId()]);
        Auth::login($user, true);
        request()->session()->regenerate();

        return match ($user->role) {
            'admin' => redirect()->intended('/admin/dashboard'),
            'guru' => redirect()->intended('/guru/dashboard'),
            default => redirect()->intended('/student/dashboard'),
        };
    }

    public function demoLogin(string $role): RedirectResponse
    {
        $email = match ($role) {
            'admin' => 'admin@gen-u.id',
            'guru' => 'budi@example.com',
            default => 'andi@example.com',
        };

        $user = User::where('email', $email)->first();

        if ($user) {
            Auth::login($user);
            return match ($user->role) {
                'admin' => redirect('/admin/dashboard'),
                'guru' => redirect('/guru/dashboard'),
                default => redirect('/student/dashboard'),
            };
        }

        return redirect()->route('login');
    }

    public function showRegister(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return match (Auth::user()->role) {
                'admin' => redirect('/admin/dashboard'),
                'guru' => redirect('/guru/dashboard'),
                default => redirect('/student/dashboard'),
            };
        }

        return Inertia::render('Auth/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,personal_email'],
            'role' => ['required', 'in:siswa,guru'],
            'school' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
        ], [
            'email.unique' => 'Email pribadi ini sudah terdaftar. Silakan gunakan email lain atau hubungi Admin.',
        ]);

        do {
            $registrationId = (string) random_int(100000000000, 999999999999);
        } while (User::where('registration_id', $registrationId)->exists());

        User::create([
            'registration_id' => $registrationId,
            'name' => $validated['name'],
            'personal_email' => $validated['email'],
            'email' => null,
            'password' => null,
            'role' => $validated['role'],
            'school' => $validated['school'],
            'phone' => $validated['phone'],
            'status' => 'pending',
        ]);

        return redirect()->route('login')->with(
            'success',
            "Pendaftaran berhasil! Nomor ID Registrasi Anda: {$registrationId}. Akun Anda sedang menunggu verifikasi oleh Admin."
        );
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
