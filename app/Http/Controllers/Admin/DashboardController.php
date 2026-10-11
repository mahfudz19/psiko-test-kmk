<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MajorCategory;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Models\RiasecQuestion;
use App\Models\User;
use App\Mail\WorkspaceCredentialsMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalUsers = User::count();
        $newRegistrations = User::where('status', 'pending')->count();
        $totalSchools = User::whereNotNull('school')
            ->where('school', '!=', '')
            ->distinct('school')
            ->count('school');

        $growth = [];
        for ($i = 1; $i <= 8; $i++) {
            $daysAgo = 8 - $i;
            $targetDate = now()->subDays($daysAgo)->endOfDay();
            $growth[] = [
                'step' => $i,
                'users' => User::where('created_at', '<=', $targetDate)->count(),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'newRegistrations' => $newRegistrations,
                'totalSchools' => $totalSchools,
                'systemStatus' => 'Sehat',
            ],
            'growth' => $growth,
        ]);
    }

    public function users(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'registration_id' => $u->registration_id ?? (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'personal_email' => $u->personal_email ?? $u->email,
                'phone' => $u->phone ?? '-',
                'role' => $u->role,
                'school' => $u->school ?? '-',
                'npsn' => $u->npsn ?? '-',
                'status' => $u->status,
                'created_at' => $u->created_at?->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function storeUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'registration_id' => ['nullable', 'string', 'size:12', 'unique:users,registration_id'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'personal_email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'role' => ['required', 'in:siswa,guru,admin'],
            'status' => ['required', 'in:active,pending,banned'],
            'school' => ['nullable', 'string', 'max:255'],
            'npsn' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $regId = $validated['registration_id'] ?? null;
        if (empty($regId)) {
            do {
                $regId = (string) random_int(100000000000, 999999999999);
            } while (User::where('registration_id', $regId)->exists());
        }

        $plainPassword = $validated['password'];
        $workspaceEmail = strtolower(trim($validated['email']));

        $user = User::create([
            'registration_id' => $regId,
            'name' => $validated['name'],
            'email' => $workspaceEmail,
            'personal_email' => $validated['personal_email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'school' => $validated['school'],
            'npsn' => $validated['npsn'] ?? null,
            'password' => Hash::make($plainPassword),
        ]);

        try {
            Mail::to($user->personal_email)->send(new WorkspaceCredentialsMail($user, $plainPassword));
        } catch (\Throwable $e) {}

        return back()->with('success', "Akun {$user->name} ({$workspaceEmail}) berhasil dibuat dan kredensial dikirimkan ke {$user->personal_email}.");
    }

    public function updateUser(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'registration_id' => ['required', 'string', 'size:12', 'unique:users,registration_id,' . $user->id],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'personal_email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'role' => ['required', 'in:siswa,guru,admin'],
            'status' => ['required', 'in:active,pending,banned'],
            'school' => ['nullable', 'string', 'max:255'],
            'npsn' => ['nullable', 'string', 'max:50'],
            'password' => [empty($user->password) ? 'required' : 'nullable', 'string', 'min:6'],
        ]);

        $oldStatus = $user->status;
        $plainPassword = $validated['password'] ?? null;

        $updateData = [
            'name' => $validated['name'],
            'registration_id' => $validated['registration_id'],
            'email' => strtolower(trim($validated['email'])),
            'personal_email' => $validated['personal_email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'school' => $validated['school'],
            'npsn' => $validated['npsn'] ?? null,
        ];

        if (!empty($plainPassword)) {
            $updateData['password'] = Hash::make($plainPassword);
        }

        $user->update($updateData);

        if (!empty($plainPassword) || ($oldStatus === 'pending' && $user->status === 'active')) {
            try {
                Mail::to($user->personal_email)->send(new WorkspaceCredentialsMail($user, $plainPassword));
            } catch (\Throwable $e) {}
        }

        return back()->with('success', "Akun {$user->name} ({$user->email}) berhasil diperbarui dan kredensial dikirimkan ke {$user->personal_email}.");
    }

    public function toggleUserStatus(int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $newStatus = $user->status === 'banned' ? 'active' : 'banned';
        $user->update(['status' => $newStatus]);

        return back()->with('success', "Status pengguna {$user->name} berhasil diubah ke {$newStatus}.");
    }

    public function inputTest(): Response
    {
        $tests = PsychometricTest::orderBy('order_num')->get();
        $totalTests = $tests->count();
        $activeGform = $tests->where('is_active', true)->filter(fn ($t) => !empty($t->gform_url))->count();
        $estimatedRespondents = RiasecAssessment::count() > 0 ? RiasecAssessment::count() + 1240 : 1248;

        return Inertia::render('Admin/InputTest', [
            'tests' => $tests,
            'stats' => [
                'totalTests' => $totalTests,
                'activeGform' => $activeGform,
                'estimatedRespondents' => number_format($estimatedRespondents),
            ],
        ]);
    }

    public function storeTest(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'gform_url' => ['required', 'string', 'max:500'],
            'spreadsheet_url' => ['nullable', 'string', 'max:500'],
        ]);

        $orderNum = (PsychometricTest::max('order_num') ?? 0) + 1;

        PsychometricTest::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'gform_url' => $validated['gform_url'],
            'spreadsheet_url' => $validated['spreadsheet_url'] ?? null,
            'order_num' => $orderNum,
            'is_active' => true,
        ]);

        return back()->with('success', 'Alat tes berhasil ditambahkan.');
    }

    public function updateTest(Request $request, int $id): RedirectResponse
    {
        $test = PsychometricTest::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'gform_url' => ['required', 'string', 'max:500'],
            'spreadsheet_url' => ['nullable', 'string', 'max:500'],
        ]);

        $test->update($validated);

        return back()->with('success', 'Alat tes berhasil diperbarui.');
    }

    public function destroyTest(int $id): RedirectResponse
    {
        $test = PsychometricTest::findOrFail($id);
        $test->delete();

        return back()->with('success', 'Alat tes berhasil dihapus.');
    }

    public function inputJurusan(): Response
    {
        $majors = Major::with('majorCategory')->latest()->get();
        $categories = MajorCategory::withCount('majors')->latest()->get();

        return Inertia::render('Admin/InputJurusan', [
            'majors' => $majors,
            'categories' => $categories,
        ]);
    }

    public function storeJurusan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'study_activities' => ['required', 'string'],
            'career_prospects' => ['required', 'string'],
        ]);

        $categoryModel = MajorCategory::firstOrCreate(['name' => $validated['category']]);

        $isKesehatan = str_contains(strtolower($validated['category']), 'kesehatan');
        $group = $isKesehatan ? 'kesehatan' : 'tech';

        $code = Str::slug($validated['title']) . '-' . substr(uniqid(), -4);

        $studyActivities = array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', (string) $validated['study_activities']))));
        $careerProspects = array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', (string) $validated['career_prospects']))));

        Major::create([
            'code' => $code,
            'title' => $validated['title'],
            'group' => $group,
            'category' => $validated['category'],
            'category_id' => $categoryModel->id,
            'jenjang' => 'S1',
            'teaser' => $validated['description'],
            'description' => $validated['description'],
            'study_activities' => $studyActivities,
            'career_prospects' => $careerProspects,
        ]);

        return back()->with('success', 'Program studi berhasil ditambahkan.');
    }

    public function updateJurusan(Request $request, int $id): RedirectResponse
    {
        $major = Major::findOrFail($id);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'study_activities' => ['required', 'string'],
            'career_prospects' => ['required', 'string'],
        ]);

        $categoryModel = MajorCategory::firstOrCreate(['name' => $validated['category']]);

        $isKesehatan = str_contains(strtolower($validated['category']), 'kesehatan');
        $group = $isKesehatan ? 'kesehatan' : 'tech';

        $studyActivities = array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', (string) $validated['study_activities']))));
        $careerProspects = array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', (string) $validated['career_prospects']))));

        $major->update([
            'title' => $validated['title'],
            'group' => $group,
            'category' => $validated['category'],
            'category_id' => $categoryModel->id,
            'teaser' => $validated['description'],
            'description' => $validated['description'],
            'study_activities' => $studyActivities,
            'career_prospects' => $careerProspects,
        ]);

        return back()->with('success', 'Program studi berhasil diperbarui.');
    }

    public function destroyJurusan(int $id): RedirectResponse
    {
        $major = Major::findOrFail($id);
        $major->delete();

        return back()->with('success', 'Program studi berhasil dihapus.');
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:major_categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        MajorCategory::create($validated);

        return back()->with('success', 'Kategori baru berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, int $id): RedirectResponse
    {
        $category = MajorCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:major_categories,name,' . $id],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($validated);

        Major::where('category_id', $category->id)->update(['category' => $validated['name']]);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory(int $id): RedirectResponse
    {
        $category = MajorCategory::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
