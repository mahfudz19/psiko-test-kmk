<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WorkspaceCredentialsMail;
use App\Models\Major;
use App\Models\MajorCategory;
use App\Models\MentorBooking;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PsychometricTest;
use App\Models\RiasecAssessment;
use App\Models\RiasecQuestion;
use App\Models\Scholarship;
use App\Models\ScholarshipCategory;
use App\Models\StudyProgram;
use App\Models\StudyProgramCategory;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
        $completedAssessments = RiasecAssessment::where('status', 'selesai')->count();
        $totalMajors = Major::count();
        $totalActiveTests = PsychometricTest::where('is_active', true)->count();
        $totalMentoring = MentorBooking::count();

        $growth = [];
        for ($i = 1; $i <= 8; $i++) {
            $daysAgo = 8 - $i;
            $targetDate = now()->subDays($daysAgo);
            $growth[] = [
                'step' => $i,
                'date' => $targetDate->translatedFormat('d M'),
                'users' => User::where('created_at', '<=', $targetDate->endOfDay())->count(),
            ];
        }

        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'school' => $u->school ?? '-',
                'status' => $u->status,
                'created_at' => $u->created_at?->diffForHumans() ?? '-',
            ];
        });

        $recentAssessments = RiasecAssessment::with(['user', 'psychometricTest'])
            ->where('status', 'selesai')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'student_name' => $a->user?->name ?? 'Siswa',
                    'test_name' => $a->psychometricTest?->name ?? 'Tes RIASEC',
                    'dominant_code' => $a->dominant_code ?? '-',
                    'completed_at' => $a->updated_at?->diffForHumans() ?? '-',
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'newRegistrations' => $newRegistrations,
                'totalSchools' => $totalSchools,
                'completedAssessments' => $completedAssessments,
                'totalStudents' => User::where('role', 'siswa')->count(),
                'totalTeachers' => User::where('role', 'guru')->count(),
            ],
            'platformSummary' => [
                'totalCompletedAssessments' => $completedAssessments,
                'totalMajors' => $totalMajors,
                'totalActiveTests' => $totalActiveTests,
                'totalMentoring' => $totalMentoring,
                'activeMentoring' => MentorBooking::whereIn('status', ['confirmed', 'pending'])->count(),
            ],
            'growth' => $growth,
            'recentUsers' => $recentUsers,
            'recentAssessments' => $recentAssessments,
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
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim email kredensial saat buat akun: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $user->id,
            ]);

            return back()->with('warning', "Akun {$user->name} ({$workspaceEmail}) berhasil dibuat, namun email kredensial gagal dikirim ke {$user->personal_email}: {$e->getMessage()}");
        }

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
            'send_email' => ['nullable', 'boolean'],
        ]);

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

        $sendEmail = $request->boolean('send_email', true);
        if ($sendEmail && !empty($user->personal_email)) {
            try {
                $mailable = new WorkspaceCredentialsMail($user, $plainPassword);
                Mail::to($user->personal_email)->send($mailable);
            } catch (\Throwable $e) {
                Log::error('DEBUG_MAIL ERROR: Terjadi kegagalan saat proses email', [
                    'pesan_error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'baris' => $e->getLine(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return back()->with('warning', "Akun {$user->name} ({$user->email}) berhasil diperbarui, namun email kredensial gagal dikirim ke {$user->personal_email}: {$e->getMessage()}");
            }

            return back()->with('success', "Akun {$user->name} ({$user->email}) berhasil diperbarui dan kredensial dikirimkan ke {$user->personal_email}.");
        }

        return back()->with('success', "Akun {$user->name} ({$user->email}) berhasil diperbarui.");
    }

    public function toggleUserStatus(int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if (empty($user->email)) {
            return back()->with('error', "Status akun {$user->name} belum dapat diubah karena belum memiliki email Google Workspace.");
        }

        $newStatus = $user->status === 'banned' ? 'active' : 'banned';
        $user->update(['status' => $newStatus]);

        return back()->with('success', "Status pengguna {$user->name} berhasil diubah ke {$newStatus}.");
    }

    public function inputTest(): Response
    {
        $tests = PsychometricTest::orderBy('order_num')->get();
        $totalTests = $tests->count();
        $activeGform = $tests->where('is_active', true)->filter(fn($t) => !empty($t->gform_url))->count();
        $totalSiswa = User::where('role', 'siswa')->count();
        $uniqueAssessmentUsers = RiasecAssessment::distinct('user_id')->count('user_id');
        $estimatedRespondents = max($totalSiswa, $uniqueAssessmentUsers);

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
            'spreadsheet_url' => ['required', 'string', 'max:500'],
        ]);

        $orderNum = (PsychometricTest::max('order_num') ?? 0) + 1;

        PsychometricTest::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'gform_url' => $validated['gform_url'],
            'spreadsheet_url' => $validated['spreadsheet_url'],
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
            'spreadsheet_url' => ['required', 'string', 'max:500'],
        ]);

        $test->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'gform_url' => $validated['gform_url'],
            'spreadsheet_url' => $validated['spreadsheet_url'],
        ]);

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

    public function monitoringTes(Request $request): Response
    {
        $tests = PsychometricTest::where('is_active', true)->orderBy('order_num')->get();
        $totalActiveTests = $tests->count();

        $importedOverallTestIds = RiasecAssessment::where('status', 'selesai')
            ->whereNotNull('dominant_code')
            ->pluck('psychometric_test_id')
            ->unique()
            ->toArray();

        $testsWithImportStatus = $tests->map(function ($t) use ($importedOverallTestIds) {
            $data = $t->toArray();
            $data['is_imported'] = in_array($t->id, $importedOverallTestIds);
            return $data;
        })->values()->all();

        $students = User::where('role', 'siswa')
            ->with(['riasecAssessments' => function ($q) {
                $q->latest();
            }])
            ->get()
            ->map(function ($student) use ($tests, $totalActiveTests) {
                $assessments = $student->riasecAssessments;
                $importedAssessments = $assessments->where('status', 'selesai')->filter(fn ($a) => !empty($a->dominant_code));
                $importedTestIds = $importedAssessments->pluck('psychometric_test_id')->unique()->toArray();
                $importedCount = count($importedTestIds);
                $allImported = $totalActiveTests > 0 && $importedCount >= $totalActiveTests;

                $completedCount = $importedCount;
                $isCompleted = $allImported;
                $statusText = $isCompleted ? 'Selesai' : ($completedCount > 0 ? "Belum Selesai ({$completedCount}/{$totalActiveTests})" : 'Belum Selesai');
                $activeAssessment = $importedAssessments->first() ?? $assessments->first();

                $importedTests = $tests->map(function ($t) use ($importedTestIds) {
                    return [
                        'id' => $t->id,
                        'name' => $t->name,
                        'is_imported' => in_array($t->id, $importedTestIds),
                    ];
                })->values()->all();

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'personal_email' => $student->personal_email,
                    'npsn' => $student->npsn ?? '-',
                    'school' => $student->school ?? '-',
                    'testStatus' => $statusText,
                    'isCompleted' => $isCompleted,
                    'completedCount' => $completedCount,
                    'totalTests' => $totalActiveTests,
                    'isAllImported' => $allImported,
                    'importedCount' => $importedCount,
                    'imported_tests' => $importedTests,
                    'dominantCode' => $activeAssessment?->dominant_code ?? '-',
                    'mentor_name' => $activeAssessment?->mentor_name ?? 'Bpk. Budi Santoso, M.Psi',
                    'assessment' => $activeAssessment,
                    'assessments' => $importedAssessments->values()->all(),
                ];
            });

        return Inertia::render('Admin/MonitoringTes', [
            'students' => $students,
            'tests' => $testsWithImportStatus,
        ]);
    }

    public function importScores(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_id' => ['required', 'exists:psychometric_tests,id'],
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $testId = (int) $validated['test_id'];
        $content = file_get_contents($request->file('file')->getRealPath());

        $res = $this->processCsvContent($content, $testId);

        if (!$res['success']) {
            return back()->with('error', $res['message']);
        }

        $test = PsychometricTest::find($testId);
        $testName = $test ? $test->name : 'alat tes';

        return back()->with('success', "Berhasil mengimpor skor {$testName} untuk {$res['importedCount']} siswa.");
    }

    public function syncSpreadsheet(Request $request): RedirectResponse
    {
        $testId = $request->input('test_id');

        if ($testId && $testId !== 'all') {
            $test = PsychometricTest::find($testId);
            if (!$test) {
                return back()->with('error', 'Alat tes tidak ditemukan.');
            }

            if (empty($test->spreadsheet_url)) {
                return back()->with('error', "Alat tes '{$test->name}' belum memiliki URL Spreadsheet. Silakan atur URL Spreadsheet pada menu Input Test terlebih dahulu.");
            }

            $tests = collect([$test]);
        } else {
            $tests = PsychometricTest::where('is_active', true)
                ->whereNotNull('spreadsheet_url')
                ->where('spreadsheet_url', '!=', '')
                ->orderBy('order_num')
                ->get();

            if ($tests->isEmpty()) {
                return back()->with('warning', 'Belum ada alat tes aktif yang memiliki URL Spreadsheet. Silakan lengkapi URL Spreadsheet pada menu Input Test terlebih dahulu.');
            }
        }

        $successList = [];
        $infoList = [];
        $errorList = [];

        foreach ($tests as $t) {
            $csvUrl = $this->convertToCsvUrl($t->spreadsheet_url);

            try {
                $response = Http::timeout(25)
                    ->withOptions(['allow_redirects' => true])
                    ->withoutVerifying()
                    ->get($csvUrl);

                if (!$response->successful()) {
                    $errorList[] = "'{$t->name}': Gagal mengunduh spreadsheet (HTTP {$response->status()}).";
                    continue;
                }

                $body = $response->body();
                $lowerBody = strtolower(substr($body, 0, 500));
                if (str_contains($lowerBody, '<!doctype html') || str_contains($lowerBody, '<html')) {
                    $errorList[] = "'{$t->name}': Spreadsheet tidak dapat diakses publik. Pastikan pengaturan berbagi (sharing) Google Spreadsheet diatur ke 'Siapa saja yang memiliki link dapat melihat'.";
                    continue;
                }

                $res = $this->processCsvContent($body, $t->id);
                if ($res['success']) {
                    if (($res['importedCount'] ?? 0) > 0) {
                        $successList[] = "{$t->name} ({$res['importedCount']} siswa)";
                    } else {
                        $infoList[] = "'{$t->name}' ({$res['message']})";
                    }
                } else {
                    $errorList[] = "'{$t->name}': {$res['message']}";
                }
            } catch (\Exception $e) {
                $errorList[] = "'{$t->name}': " . $e->getMessage();
            }
        }

        if (!empty($successList) && empty($errorList)) {
            $detailSuccess = implode(', ', $successList);
            $detailInfo = !empty($infoList) ? ' Catatan: ' . implode('; ', $infoList) . '.' : '';
            return back()->with('success', "Sinkronisasi otomatis berhasil untuk: {$detailSuccess}.{$detailInfo}");
        }

        if (empty($successList) && !empty($infoList) && empty($errorList)) {
            $detailInfo = implode('; ', $infoList);
            return back()->with('success', "Spreadsheet berhasil terhubung: {$detailInfo}. Nilai siswa akan otomatis tersinkronisasi saat siswa telah mengisi formulir tes.");
        }

        if (!empty($successList) || !empty($infoList)) {
            $allDone = array_merge($successList, $infoList);
            $detailSuccess = implode('; ', $allDone);
            $detailError = implode('; ', $errorList);
            return back()->with('warning', "Sinkronisasi selesai dengan catatan: {$detailSuccess}. Kendala: {$detailError}");
        }

        $detailError = implode('; ', $errorList);
        return back()->with('error', "Gagal menyinkronkan data spreadsheet: {$detailError}");
    }

    private function convertToCsvUrl(string $url): string
    {
        $url = trim($url);

        if (str_contains($url, 'output=csv') || str_contains($url, 'format=csv')) {
            return $url;
        }

        $gid = null;
        if (preg_match('/[?&#]gid=([0-9]+)/', $url, $gidMatch)) {
            $gid = $gidMatch[1];
        }

        if (preg_match('/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/', $url, $pubMatch)) {
            $base = "https://docs.google.com/spreadsheets/d/e/{$pubMatch[1]}/pub?output=csv";
            return $gid ? "{$base}&gid={$gid}" : $base;
        }

        if (preg_match('/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/', $url, $idMatch)) {
            $sheetId = $idMatch[1];
            $base = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv";
            return $gid ? "{$base}&gid={$gid}" : $base;
        }

        return $url;
    }

    private function processCsvContent(string $content, int $testId): array
    {
        $content = trim($content);
        if ($content === '') {
            return [
                'success' => false,
                'message' => 'Konten spreadsheet kosong atau tidak dapat diunduh.',
                'importedCount' => 0,
            ];
        }

        $lines = preg_split('/\r\n|\r|\n/', $content);
        if (empty($lines)) {
            return [
                'success' => false,
                'message' => 'Format file CSV tidak valid atau kosong.',
                'importedCount' => 0,
            ];
        }

        $firstLine = $lines[0];
        $separator = ',';
        if (substr_count($firstLine, "\t") > substr_count($firstLine, ',')) {
            $separator = "\t";
        } elseif (substr_count($firstLine, ';') > substr_count($firstLine, ',')) {
            $separator = ';';
        }

        $rawHeaders = str_getcsv($firstLine, $separator);
        if (empty($rawHeaders) || count($rawHeaders) < 2) {
            return [
                'success' => false,
                'message' => 'Header kolom spreadsheet tidak valid atau tidak terbaca.',
                'importedCount' => 0,
            ];
        }

        $headers = array_map(function ($h) {
            return strtolower(trim(str_replace(['"', "'", "\xEF\xBB\xBF"], '', $h)));
        }, $rawHeaders);

        $emailIndex = -1;
        $scoreIndices = [
            'r' => -1,
            'i' => -1,
            'a' => -1,
            's' => -1,
            'e' => -1,
            'c' => -1,
        ];
        $dominantCodeIndex = -1;
        $mentorIndex = -1;

        $hasExplicitScores = false;
        $metaColumnPatterns = ['timestamp', 'waktu', 'email', 'surel', 'username', 'nama', 'name', 'kelas', 'class', 'absen', 'attendance', 'guru', 'mentor', 'npsn', 'sekolah', 'school'];
        $descIndices = ['r' => -1, 'i' => -1, 'a' => -1, 's' => -1, 'e' => -1, 'c' => -1];
        $majorsIndices = ['r' => -1, 'i' => -1, 'a' => -1, 's' => -1, 'e' => -1, 'c' => -1];

        foreach ($headers as $idx => $header) {
            if (str_contains($header, 'email') || str_contains($header, 'surel') || str_contains($header, 'username')) {
                $emailIndex = $idx;
            } elseif (in_array($header, ['score_r', 'skor_r', 'r', 'realistic'])) {
                $scoreIndices['r'] = $idx;
                $hasExplicitScores = true;
            } elseif (in_array($header, ['score_i', 'skor_i', 'i', 'investigative'])) {
                $scoreIndices['i'] = $idx;
                $hasExplicitScores = true;
            } elseif (in_array($header, ['score_a', 'skor_a', 'a', 'artistic'])) {
                $scoreIndices['a'] = $idx;
                $hasExplicitScores = true;
            } elseif (in_array($header, ['score_s', 'skor_s', 's', 'social'])) {
                $scoreIndices['s'] = $idx;
                $hasExplicitScores = true;
            } elseif (in_array($header, ['score_e', 'skor_e', 'e', 'enterprising'])) {
                $scoreIndices['e'] = $idx;
                $hasExplicitScores = true;
            } elseif (in_array($header, ['score_c', 'skor_c', 'c', 'conventional'])) {
                $scoreIndices['c'] = $idx;
                $hasExplicitScores = true;
            } elseif (in_array($header, ['dominant_code', 'kode_dominan', 'kode', 'hasil'])) {
                $dominantCodeIndex = $idx;
            } elseif (str_contains($header, 'guru') || str_contains($header, 'mentor') || str_contains($header, 'pembimbing')) {
                $mentorIndex = $idx;
            }

            foreach (['r', 'i', 'a', 's', 'e', 'c'] as $dim) {
                if (in_array($header, ["desc_{$dim}", "deskripsi_{$dim}"])) {
                    $descIndices[$dim] = $idx;
                }
                if (in_array($header, ["majors_{$dim}", "jurusan_{$dim}", "bidang_studi_{$dim}"])) {
                    $majorsIndices[$dim] = $idx;
                }
            }
        }

        if ($emailIndex === -1) {
            return [
                'success' => false,
                'message' => 'Kolom email tidak ditemukan dalam file. Pastikan terdapat kolom email (seperti "Email Resmi Google Workspace Gen-U").',
                'importedCount' => 0,
            ];
        }

        $hasDataRows = false;
        for ($i = 1; $i < count($lines); $i++) {
            if (trim($lines[$i]) !== '') {
                $hasDataRows = true;
                break;
            }
        }

        if (!$hasDataRows) {
            return [
                'success' => true,
                'message' => 'lembar spreadsheet saat ini belum memiliki respon jawaban siswa',
                'importedCount' => 0,
            ];
        }

        $riasecItemMap = [
            'r' => [1, 3, 7, 14, 21, 22, 37],
            'i' => [2, 11, 18, 19, 26, 32, 33],
            'a' => [8, 17, 20, 23, 27, 31, 41],
            's' => [4, 12, 13, 28, 34, 38, 40],
            'e' => [5, 10, 15, 16, 29, 36, 42],
            'c' => [6, 9, 24, 25, 35, 38, 39],
        ];

        $keywordPatterns = [
            1 => 'mengulik',
            2 => 'puzzle',
            3 => 'bekerja mandiri',
            4 => 'dalam kelompok',
            5 => 'target',
            6 => 'merapikan barang',
            7 => 'lego',
            8 => 'seni dan musik',
            9 => 'instruksi yang jelas',
            10 => 'meyakinkan teman',
            11 => 'percobaan',
            12 => 'menjelaskan sesuatu',
            13 => 'membantu orang',
            14 => 'memelihara binatang',
            15 => 'melebihi waktu',
            16 => 'menjual sesuatu',
            17 => 'karya berbentuk tulisan',
            18 => 'sains',
            19 => 'tantangan baru',
            20 => 'menghibur teman',
            21 => 'cara kerja',
            22 => 'merakit',
            23 => 'kreatif',
            24 => 'memperhatikan detail',
            25 => 'merapikan catatan',
            26 => 'penyebab suatu kejadian',
            27 => 'alat musik',
            28 => 'budaya berbagai daerah',
            29 => 'membuka usaha',
            31 => 'bermain peran',
            32 => 'mempraktikkan',
            33 => 'matematika',
            34 => 'mendiskusikan',
            35 => 'merapikan kamar',
            36 => 'memimpin',
            37 => 'luar ruangan',
            38 => 'meja-kursi',
            39 => 'menghitung',
            40 => 'menolong orang',
            41 => 'menggambar',
            42 => 'berbicara di depan umum',
        ];

        $columnToItemMap = [];
        $unmappedQuestionCols = [];

        if (!$hasExplicitScores) {
            foreach ($headers as $colIdx => $header) {
                if ($colIdx === $emailIndex || $colIdx === $mentorIndex || $colIdx === $dominantCodeIndex) {
                    continue;
                }

                $isMeta = false;
                foreach ($metaColumnPatterns as $pattern) {
                    if (str_contains($header, $pattern)) {
                        $isMeta = true;
                        break;
                    }
                }
                if ($isMeta) continue;

                $matchedNum = null;
                if (preg_match('/(?:pertanyaan|butir|soal|p)?\s*(\d{1,2})/i', $header, $matches)) {
                    $num = (int)$matches[1];
                    if ($num >= 1 && $num <= 42) {
                        $matchedNum = $num;
                    }
                }

                if (!$matchedNum) {
                    foreach ($keywordPatterns as $itemNum => $keyword) {
                        if (str_contains($header, $keyword)) {
                            $matchedNum = $itemNum;
                            break;
                        }
                    }
                }

                if ($matchedNum) {
                    $columnToItemMap[$colIdx] = $matchedNum;
                } else {
                    $unmappedQuestionCols[] = $colIdx;
                }
            }

            if (empty($columnToItemMap) && count($unmappedQuestionCols) >= 6) {
                foreach ($unmappedQuestionCols as $orderIdx => $colIdx) {
                    $itemNum = ($orderIdx % 42) + 1;
                    $columnToItemMap[$colIdx] = $itemNum;
                }
            }
        }

        $timestampIndex = -1;
        foreach ($headers as $idx => $header) {
            if (str_contains($header, 'timestamp') || str_contains($header, 'waktu') || str_contains($header, 'tanggal')) {
                $timestampIndex = $idx;
                break;
            }
        }

        $parseTimestampToEpoch = function (?string $timestampStr, int $rowOrder): int {
            if (empty($timestampStr)) {
                return $rowOrder;
            }

            $timestampStr = trim($timestampStr);

            $d = \DateTime::createFromFormat('d/m/Y H:i:s', $timestampStr);
            if ($d !== false) {
                return $d->getTimestamp();
            }

            $d = \DateTime::createFromFormat('d/m/Y H:i', $timestampStr);
            if ($d !== false) {
                return $d->getTimestamp();
            }

            $d = \DateTime::createFromFormat('Y-m-d H:i:s', $timestampStr);
            if ($d !== false) {
                return $d->getTimestamp();
            }

            $time = strtotime($timestampStr);
            if ($time !== false && $time > 0) {
                return $time;
            }

            return $rowOrder;
        };

        $rowsByEmail = [];

        for ($i = 1; $i < count($lines); $i++) {
            $rowString = trim($lines[$i]);
            if (empty($rowString)) continue;

            $row = str_getcsv($rowString, $separator);
            $email = isset($row[$emailIndex]) ? strtolower(trim($row[$emailIndex])) : '';
            if (empty($email)) continue;

            $timestampVal = ($timestampIndex !== -1 && isset($row[$timestampIndex])) ? $row[$timestampIndex] : null;
            $epoch = $parseTimestampToEpoch($timestampVal, $i);

            if (!isset($rowsByEmail[$email]) || $epoch > $rowsByEmail[$email]['epoch']) {
                $rowsByEmail[$email] = [
                    'row' => $row,
                    'epoch' => $epoch,
                ];
            }
        }

        $importedCount = 0;

        foreach ($rowsByEmail as $email => $itemData) {
            $row = $itemData['row'];

            $user = User::where('email', $email)
                ->orWhere('personal_email', $email)
                ->first();

            if (!$user) {
                $user = User::whereNotNull('registration_id')
                    ->where('registration_id', '!=', '')
                    ->where(function ($q) use ($email) {
                        $q->whereRaw('? LIKE CONCAT("%", registration_id, "%")', [$email]);
                    })
                    ->first();
            }

            if (!$user) continue;

            if ($hasExplicitScores) {
                $scoreR = $scoreIndices['r'] !== -1 && isset($row[$scoreIndices['r']]) ? (int)$row[$scoreIndices['r']] : 15;
                $scoreI = $scoreIndices['i'] !== -1 && isset($row[$scoreIndices['i']]) ? (int)$row[$scoreIndices['i']] : 22;
                $scoreA = $scoreIndices['a'] !== -1 && isset($row[$scoreIndices['a']]) ? (int)$row[$scoreIndices['a']] : 24;
                $scoreS = $scoreIndices['s'] !== -1 && isset($row[$scoreIndices['s']]) ? (int)$row[$scoreIndices['s']] : 26;
                $scoreE = $scoreIndices['e'] !== -1 && isset($row[$scoreIndices['e']]) ? (int)$row[$scoreIndices['e']] : 20;
                $scoreC = $scoreIndices['c'] !== -1 && isset($row[$scoreIndices['c']]) ? (int)$row[$scoreIndices['c']] : 17;
            } else {
                $itemAnswers = [];

                foreach ($columnToItemMap as $colIdx => $itemNum) {
                    $val = isset($row[$colIdx]) ? strtolower(trim($row[$colIdx])) : '';
                    if ($val === '4' || $val === 'ss' || str_contains($val, 'sangat suka') || str_contains($val, 'sangat setuju')) {
                        $points = 4;
                    } elseif ($val === '3' || $val === 's' || (str_contains($val, 'suka') && !str_contains($val, 'tidak')) || (str_contains($val, 'setuju') && !str_contains($val, 'tidak'))) {
                        $points = 3;
                    } elseif ($val === '2' || $val === 'ts' || (str_contains($val, 'tidak suka') && !str_contains($val, 'sangat')) || (str_contains($val, 'tidak setuju') && !str_contains($val, 'sangat'))) {
                        $points = 2;
                    } elseif ($val === '1' || $val === 'sts' || str_contains($val, 'sangat tidak suka') || str_contains($val, 'sangat tidak setuju')) {
                        $points = 1;
                    } elseif (is_numeric($val)) {
                        $points = max(1, min(4, (int) $val));
                    } else {
                        $points = 1;
                    }

                    $itemAnswers[$itemNum] = $points;
                }

                $calculateDimensionScore = function (array $itemNumbers) use ($itemAnswers): int {
                    $sum = 0;
                    foreach ($itemNumbers as $num) {
                        $sum += $itemAnswers[$num] ?? 1;
                    }
                    return min(28, $sum);
                };

                $scoreR = $calculateDimensionScore($riasecItemMap['r']);
                $scoreI = $calculateDimensionScore($riasecItemMap['i']);
                $scoreA = $calculateDimensionScore($riasecItemMap['a']);
                $scoreS = $calculateDimensionScore($riasecItemMap['s']);
                $scoreE = $calculateDimensionScore($riasecItemMap['e']);
                $scoreC = $calculateDimensionScore($riasecItemMap['c']);
            }

            $dominantCode = null;
            if ($dominantCodeIndex !== -1 && !empty($row[$dominantCodeIndex])) {
                $dominantCode = strtoupper(trim($row[$dominantCodeIndex]));
            } else {
                $dims = [
                    'R' => $scoreR,
                    'I' => $scoreI,
                    'A' => $scoreA,
                    'S' => $scoreS,
                    'E' => $scoreE,
                    'C' => $scoreC,
                ];
                arsort($dims);
                $dominantCode = implode('', array_slice(array_keys($dims), 0, 3));
            }

            $mentorName = $mentorIndex !== -1 && !empty($row[$mentorIndex])
                ? trim($row[$mentorIndex])
                : ($user->selected_mentor ?? 'Bpk. Budi Santoso, M.Psi');

            $customDimensions = [];
            foreach (['r', 'i', 'a', 's', 'e', 'c'] as $dim) {
                $code = strtoupper($dim);
                $dimData = [];
                if ($descIndices[$dim] !== -1 && isset($row[$descIndices[$dim]]) && trim($row[$descIndices[$dim]]) !== '') {
                    $dimData['desc'] = trim($row[$descIndices[$dim]]);
                }
                if ($majorsIndices[$dim] !== -1 && isset($row[$majorsIndices[$dim]]) && trim($row[$majorsIndices[$dim]]) !== '') {
                    $dimData['majors'] = trim($row[$majorsIndices[$dim]]);
                }
                if (!empty($dimData)) {
                    $customDimensions[$code] = $dimData;
                }
            }

            $existingAssessment = RiasecAssessment::where('user_id', $user->id)
                ->where('psychometric_test_id', $testId)
                ->first();

            $existingAnswers = is_array($existingAssessment?->answers) ? $existingAssessment->answers : [];
            if (!empty($customDimensions)) {
                $existingAnswers['dimensions'] = array_merge($existingAnswers['dimensions'] ?? [], $customDimensions);
            }

            RiasecAssessment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'psychometric_test_id' => $testId,
                ],
                [
                    'score_r' => $scoreR,
                    'score_i' => $scoreI,
                    'score_a' => $scoreA,
                    'score_s' => $scoreS,
                    'score_e' => $scoreE,
                    'score_c' => $scoreC,
                    'dominant_code' => $dominantCode,
                    'mentor_name' => $mentorName,
                    'status' => 'selesai',
                    'answers' => !empty($existingAnswers) ? $existingAnswers : null,
                ]
            );

            $importedCount++;
        }

        if ($importedCount === 0) {
            return [
                'success' => true,
                'message' => 'terdapat data respon namun belum ada email yang cocok dengan siswa terdaftar',
                'importedCount' => 0,
            ];
        }

        return [
            'success' => true,
            'message' => "Berhasil mengimpor skor untuk {$importedCount} siswa.",
            'importedCount' => $importedCount,
        ];
    }

    public function updateStudentScore(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'score_r' => ['required', 'integer', 'min:0', 'max:28'],
            'score_i' => ['required', 'integer', 'min:0', 'max:28'],
            'score_a' => ['required', 'integer', 'min:0', 'max:28'],
            'score_s' => ['required', 'integer', 'min:0', 'max:28'],
            'score_e' => ['required', 'integer', 'min:0', 'max:28'],
            'score_c' => ['required', 'integer', 'min:0', 'max:28'],
            'dominant_code' => ['nullable', 'string', 'max:10'],
            'mentor_name' => ['nullable', 'string', 'max:255'],
            'psychometric_test_id' => ['nullable', 'integer'],
            'dimension_customizations' => ['nullable', 'array'],
        ]);

        $student = User::findOrFail($id);

        $testId = $validated['psychometric_test_id']
            ?? PsychometricTest::where('is_active', true)->orderBy('order_num')->first()?->id;

        $dominantCode = $validated['dominant_code'];
        if (empty($dominantCode)) {
            $dims = [
                'R' => $validated['score_r'],
                'I' => $validated['score_i'],
                'A' => $validated['score_a'],
                'S' => $validated['score_s'],
                'E' => $validated['score_e'],
                'C' => $validated['score_c'],
            ];
            arsort($dims);
            $dominantCode = implode('', array_slice(array_keys($dims), 0, 3));
        }

        $existingAssessment = RiasecAssessment::where('user_id', $student->id)
            ->where('psychometric_test_id', $testId)
            ->first();

        $answers = is_array($existingAssessment?->answers) ? $existingAssessment->answers : [];
        if (isset($validated['dimension_customizations'])) {
            $answers['dimensions'] = $validated['dimension_customizations'];
        }

        RiasecAssessment::updateOrCreate(
            [
                'user_id' => $student->id,
                'psychometric_test_id' => $testId,
            ],
            [
                'score_r' => $validated['score_r'],
                'score_i' => $validated['score_i'],
                'score_a' => $validated['score_a'],
                'score_s' => $validated['score_s'],
                'score_e' => $validated['score_e'],
                'score_c' => $validated['score_c'],
                'dominant_code' => strtoupper($dominantCode),
                'mentor_name' => !empty($validated['mentor_name']) ? $validated['mentor_name'] : ($existingAssessment?->mentor_name ?? 'Bpk. Budi Santoso, M.Psi'),
                'status' => 'selesai',
                'answers' => !empty($answers) ? $answers : null,
            ]
        );

        return back()->with('success', "Skor asesmen untuk {$student->name} berhasil diperbarui.");
    }

    public function monitoringTestimoni(): Response
    {
        $testimonials = Testimonial::with('user:id,name,avatar')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/MonitoringTestimoni', [
            'testimonials' => $testimonials,
        ]);
    }

    public function storeTestimonial(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:Siswa,Guru',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string',
            'avatar' => 'nullable',
        ]);

        $data = [
            'name' => $validated['name'],
            'role' => $validated['role'],
            'rating' => $validated['rating'],
            'content' => $validated['content'],
            'is_published' => false,
        ];

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('testimonials', 'public');
            $data['avatar'] = '/storage/' . $path;
        } elseif ($request->filled('avatar')) {
            $data['avatar'] = $request->input('avatar');
        }

        Testimonial::create($data);

        return back()->with('success', 'Testimoni berhasil ditambahkan.');
    }

    public function updateTestimonial(Request $request, $id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:Siswa,Guru',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string',
            'avatar' => 'nullable',
        ]);

        $data = [
            'name' => $validated['name'],
            'role' => $validated['role'],
            'rating' => $validated['rating'],
            'content' => $validated['content'],
        ];

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('testimonials', 'public');
            $data['avatar'] = '/storage/' . $path;
        } elseif ($request->has('avatar')) {
            $data['avatar'] = $request->input('avatar') ?: null;
        }

        $testimonial->update($data);

        return back()->with('success', 'Testimoni berhasil diperbarui.');
    }

    public function togglePublishTestimonial($id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update([
            'is_published' => !$testimonial->is_published,
        ]);

        return back()->with('success', 'Status publikasi testimoni berhasil diubah.');
    }

    public function destroyTestimonial($id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return back()->with('success', 'Testimoni berhasil dihapus.');
    }

    public function storeFeedback(Request $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string',
        ]);

        Testimonial::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'role' => $user->role === 'guru' ? 'Guru' : 'Siswa',
            'rating' => $validated['rating'],
            'content' => !empty($validated['content']) ? $validated['content'] : 'Aplikasi Gen-U sangat bermanfaat dan mudah digunakan.',
            'avatar' => $user->avatar,
            'is_published' => false,
        ]);

        return back()->with('success', 'Terima kasih atas masukan Anda.');
    }

    public function program(): Response
    {
        $programs = StudyProgram::with('category')->latest()->get();
        $categories = StudyProgramCategory::withCount('studyPrograms')->latest()->get();

        return Inertia::render('Admin/Program', [
            'programs' => $programs,
            'categories' => $categories,
        ]);
    }

    public function storeProgram(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:study_program_categories,id',
            'status' => 'required|string|max:50',
            'academic_degree' => 'required|string|max:255',
            'short_description' => 'required|string',
            'detailed_description' => 'nullable|string',
            'career_prospects' => 'nullable',
            'icon' => 'nullable',
        ]);

        $data = [
            'name' => trim($validated['name']),
            'category_id' => $validated['category_id'] ?? null,
            'status' => $validated['status'],
            'academic_degree' => trim($validated['academic_degree']),
            'short_description' => trim($validated['short_description']),
            'detailed_description' => $validated['detailed_description'] ?? null,
        ];

        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('programs', 'public');
            $data['icon'] = '/storage/' . $path;
        }

        $careerProspects = $request->input('career_prospects');
        if (is_string($careerProspects)) {
            $careerProspects = json_decode($careerProspects, true);
        }
        if (is_array($careerProspects)) {
            foreach ($careerProspects as $index => &$career) {
                if ($request->hasFile("career_icon_{$index}")) {
                    $cPath = $request->file("career_icon_{$index}")->store('programs/careers', 'public');
                    $career['icon'] = '/storage/' . $cPath;
                }
            }
            $data['career_prospects'] = $careerProspects;
        }

        StudyProgram::create($data);

        return back()->with('success', 'Program studi berhasil ditambahkan.');
    }

    public function updateProgram(Request $request, $id): RedirectResponse
    {
        $program = StudyProgram::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:study_program_categories,id',
            'status' => 'required|string|max:50',
            'academic_degree' => 'required|string|max:255',
            'short_description' => 'required|string',
            'detailed_description' => 'nullable|string',
            'career_prospects' => 'nullable',
            'icon' => 'nullable',
        ]);

        $data = [
            'name' => trim($validated['name']),
            'category_id' => $validated['category_id'] ?? null,
            'status' => $validated['status'],
            'academic_degree' => trim($validated['academic_degree']),
            'short_description' => trim($validated['short_description']),
            'detailed_description' => $validated['detailed_description'] ?? null,
        ];

        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('programs', 'public');
            $data['icon'] = '/storage/' . $path;
        } elseif ($request->has('icon') && empty($request->input('icon'))) {
            $data['icon'] = null;
        }

        $careerProspects = $request->input('career_prospects');
        if (is_string($careerProspects)) {
            $careerProspects = json_decode($careerProspects, true);
        }
        if (is_array($careerProspects)) {
            foreach ($careerProspects as $index => &$career) {
                if ($request->hasFile("career_icon_{$index}")) {
                    $cPath = $request->file("career_icon_{$index}")->store('programs/careers', 'public');
                    $career['icon'] = '/storage/' . $cPath;
                }
            }
            $data['career_prospects'] = $careerProspects;
        }

        $program->update($data);

        return back()->with('success', 'Program studi berhasil diperbarui.');
    }

    public function destroyProgram($id): RedirectResponse
    {
        $program = StudyProgram::findOrFail($id);
        $program->delete();

        return back()->with('success', 'Program studi berhasil dihapus.');
    }

    public function storeProgramCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:study_program_categories,name',
            'description' => 'nullable|string',
        ]);

        StudyProgramCategory::create([
            'name' => trim($validated['name']),
            'description' => !empty($validated['description']) ? trim($validated['description']) : null,
        ]);

        return back()->with('success', 'Kategori program studi berhasil ditambahkan.');
    }

    public function updateProgramCategory(Request $request, $id): RedirectResponse
    {
        $category = StudyProgramCategory::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:study_program_categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => trim($validated['name']),
            'description' => !empty($validated['description']) ? trim($validated['description']) : null,
        ]);

        return back()->with('success', 'Kategori program studi berhasil diperbarui.');
    }

    public function destroyProgramCategory($id): RedirectResponse
    {
        $category = StudyProgramCategory::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Kategori program studi berhasil dihapus.');
    }

    public function uploadEditorImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|max:5120',
        ]);

        $path = $request->file('image')->store('editor-images', 'public');

        return response()->json([
            'url' => '/storage/' . $path,
        ]);
    }

    public function beasiswa(): Response
    {
        $scholarships = Scholarship::with('category')->latest()->get();
        $categories = ScholarshipCategory::withCount('scholarships')->latest()->get();

        return Inertia::render('Admin/Beasiswa', [
            'scholarships' => $scholarships,
            'categories' => $categories,
        ]);
    }

    public function storeScholarshipCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:scholarship_categories,name',
            'badge_color' => 'nullable|string|max:100',
        ]);

        ScholarshipCategory::create([
            'name' => trim($validated['name']),
            'badge_color' => $validated['badge_color'] ?: 'bg-blue-100 text-blue-700',
        ]);

        return back()->with('success', 'Kategori / Tag beasiswa berhasil ditambahkan.');
    }

    public function updateScholarshipCategory(Request $request, $id): RedirectResponse
    {
        $category = ScholarshipCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:scholarship_categories,name,' . $category->id,
            'badge_color' => 'nullable|string|max:100',
        ]);

        $category->update([
            'name' => trim($validated['name']),
            'badge_color' => $validated['badge_color'] ?: 'bg-blue-100 text-blue-700',
        ]);

        // Keep existing scholarships synced if they use this category
        Scholarship::where('category_id', $category->id)->update([
            'tag' => $category->name,
            'tag_color' => $category->badge_color,
        ]);

        return back()->with('success', 'Kategori / Tag beasiswa berhasil diperbarui.');
    }

    public function destroyScholarshipCategory($id): RedirectResponse
    {
        $category = ScholarshipCategory::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Kategori / Tag beasiswa berhasil dihapus.');
    }

    public function storeScholarship(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:scholarship_categories,id',
            'name' => 'required|string|max:255',
            'organizer' => 'required|string|max:255',
            'tag' => 'nullable|string|max:100',
            'tag_color' => 'nullable|string|max:100',
            'border_color' => 'nullable|string|max:50',
            'quota' => 'nullable|string|max:100',
            'deadline' => 'nullable|string|max:100',
            'status' => 'required|string|max:50',
            'link_url' => 'nullable|string|max:255',
            'summary_benefits' => 'nullable',
            'benefits' => 'nullable',
            'requirements' => 'nullable',
            'documents' => 'nullable',
            'image' => 'nullable',
        ]);

        $tag = $validated['tag'] ?? '';
        $tagColor = $validated['tag_color'] ?? 'bg-blue-100 text-blue-700';

        if (!empty($validated['category_id'])) {
            $cat = ScholarshipCategory::find($validated['category_id']);
            if ($cat) {
                $tag = $cat->name;
                $tagColor = $cat->badge_color;
            }
        }

        $data = [
            'category_id' => $validated['category_id'] ?? null,
            'name' => trim($validated['name']),
            'organizer' => trim($validated['organizer']),
            'tag' => trim($tag),
            'tag_color' => $tagColor,
            'border_color' => $validated['border_color'] ?? '#284f7a',
            'quota' => !empty($validated['quota']) ? trim($validated['quota']) : null,
            'deadline' => !empty($validated['deadline']) ? trim($validated['deadline']) : null,
            'status' => $validated['status'] ?? 'Aktif (Tampil)',
            'link_url' => !empty($validated['link_url']) ? trim($validated['link_url']) : null,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('scholarships', 'public');
            $data['image'] = '/storage/' . $path;
        }

        foreach (['summary_benefits', 'benefits', 'requirements', 'documents'] as $field) {
            $val = $request->input($field);
            if (is_string($val)) {
                $decoded = json_decode($val, true);
                $val = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $val)));
            }
            if (is_array($val)) {
                $data[$field] = array_values(array_filter($val, fn($item) => !empty(trim((string)$item))));
            }
        }

        Scholarship::create($data);

        return back()->with('success', 'Beasiswa berhasil ditambahkan.');
    }

    public function updateScholarship(Request $request, $id): RedirectResponse
    {
        $scholarship = Scholarship::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'nullable|exists:scholarship_categories,id',
            'name' => 'required|string|max:255',
            'organizer' => 'required|string|max:255',
            'tag' => 'nullable|string|max:100',
            'tag_color' => 'nullable|string|max:100',
            'border_color' => 'nullable|string|max:50',
            'quota' => 'nullable|string|max:100',
            'deadline' => 'nullable|string|max:100',
            'status' => 'required|string|max:50',
            'link_url' => 'nullable|string|max:255',
            'summary_benefits' => 'nullable',
            'benefits' => 'nullable',
            'requirements' => 'nullable',
            'documents' => 'nullable',
            'image' => 'nullable',
        ]);

        $tag = $validated['tag'] ?? $scholarship->tag;
        $tagColor = $validated['tag_color'] ?? $scholarship->tag_color;

        if (!empty($validated['category_id'])) {
            $cat = ScholarshipCategory::find($validated['category_id']);
            if ($cat) {
                $tag = $cat->name;
                $tagColor = $cat->badge_color;
            }
        }

        $data = [
            'category_id' => $validated['category_id'] ?? null,
            'name' => trim($validated['name']),
            'organizer' => trim($validated['organizer']),
            'tag' => trim($tag),
            'tag_color' => $tagColor,
            'border_color' => $validated['border_color'] ?? '#284f7a',
            'quota' => !empty($validated['quota']) ? trim($validated['quota']) : null,
            'deadline' => !empty($validated['deadline']) ? trim($validated['deadline']) : null,
            'status' => $validated['status'] ?? 'Aktif (Tampil)',
            'link_url' => !empty($validated['link_url']) ? trim($validated['link_url']) : null,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('scholarships', 'public');
            $data['image'] = '/storage/' . $path;
        } elseif ($request->has('image') && empty($request->input('image'))) {
            $data['image'] = null;
        }

        foreach (['summary_benefits', 'benefits', 'requirements', 'documents'] as $field) {
            $val = $request->input($field);
            if (is_string($val)) {
                $decoded = json_decode($val, true);
                $val = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode("\n", $val)));
            }
            if (is_array($val)) {
                $data[$field] = array_values(array_filter($val, fn($item) => !empty(trim((string)$item))));
            }
        }

        $scholarship->update($data);

        return back()->with('success', 'Beasiswa berhasil diperbarui.');
    }

    public function destroyScholarship($id): RedirectResponse
    {
        $scholarship = Scholarship::findOrFail($id);
        $scholarship->delete();

        return back()->with('success', 'Beasiswa berhasil dihapus.');
    }

    public function beritaArtikel(): Response
    {
        $posts = Post::with('category')->latest()->get();
        $categories = PostCategory::withCount('posts')->latest()->get();

        return Inertia::render('Admin/BeritaArtikel', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function storePostCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:post_categories,name',
            'badge_color' => 'nullable|string|max:100',
        ]);

        PostCategory::create([
            'name' => trim($validated['name']),
            'slug' => Str::slug($validated['name']),
            'badge_color' => $validated['badge_color'] ?: 'bg-blue-100 text-blue-700',
        ]);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updatePostCategory(Request $request, $id): RedirectResponse
    {
        $category = PostCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:post_categories,name,' . $category->id,
            'badge_color' => 'nullable|string|max:100',
        ]);

        $category->update([
            'name' => trim($validated['name']),
            'slug' => Str::slug($validated['name']),
            'badge_color' => $validated['badge_color'] ?: 'bg-blue-100 text-blue-700',
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyPostCategory($id): RedirectResponse
    {
        $category = PostCategory::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    public function storePost(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:berita,webinar,pengumuman',
            'category_id' => 'nullable|exists:post_categories,id',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'author' => 'nullable|string|max:100',
            'read_time' => 'nullable|string|max:50',
            'event_date' => 'nullable|string|max:100',
            'event_time' => 'nullable|string|max:100',
            'event_link' => 'nullable|string|max:255',
            'badge_label' => 'nullable|string|max:50',
            'status' => 'required|string|max:50',
            'image' => 'nullable',
        ]);

        $slugBase = Str::slug($validated['title']);
        $slug = $slugBase;
        $counter = 1;
        while (Post::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . $counter++;
        }

        $data = [
            'category_id' => ($validated['type'] === 'berita') ? ($validated['category_id'] ?? null) : null,
            'type' => $validated['type'],
            'title' => trim($validated['title']),
            'slug' => $slug,
            'excerpt' => !empty($validated['excerpt']) ? trim($validated['excerpt']) : null,
            'content' => $validated['content'] ?? null,
            'author' => !empty($validated['author']) ? trim($validated['author']) : 'Tim Gen-U',
            'read_time' => !empty($validated['read_time']) ? trim($validated['read_time']) : null,
            'event_date' => !empty($validated['event_date']) ? trim($validated['event_date']) : null,
            'event_time' => !empty($validated['event_time']) ? trim($validated['event_time']) : null,
            'event_link' => !empty($validated['event_link']) ? trim($validated['event_link']) : null,
            'badge_label' => !empty($validated['badge_label']) ? trim($validated['badge_label']) : null,
            'status' => $validated['status'] ?? 'Aktif (Tampil)',
            'published_at' => now(),
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $data['image'] = '/storage/' . $path;
        }

        Post::create($data);

        return back()->with('success', 'Konten berhasil ditambahkan.');
    }

    public function updatePost(Request $request, $id): RedirectResponse
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:berita,webinar,pengumuman',
            'category_id' => 'nullable|exists:post_categories,id',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'author' => 'nullable|string|max:100',
            'read_time' => 'nullable|string|max:50',
            'event_date' => 'nullable|string|max:100',
            'event_time' => 'nullable|string|max:100',
            'event_link' => 'nullable|string|max:255',
            'badge_label' => 'nullable|string|max:50',
            'status' => 'required|string|max:50',
            'image' => 'nullable',
        ]);

        $data = [
            'category_id' => ($validated['type'] === 'berita') ? ($validated['category_id'] ?? null) : null,
            'type' => $validated['type'],
            'title' => trim($validated['title']),
            'excerpt' => !empty($validated['excerpt']) ? trim($validated['excerpt']) : null,
            'content' => $validated['content'] ?? null,
            'author' => !empty($validated['author']) ? trim($validated['author']) : 'Tim Gen-U',
            'read_time' => !empty($validated['read_time']) ? trim($validated['read_time']) : null,
            'event_date' => !empty($validated['event_date']) ? trim($validated['event_date']) : null,
            'event_time' => !empty($validated['event_time']) ? trim($validated['event_time']) : null,
            'event_link' => !empty($validated['event_link']) ? trim($validated['event_link']) : null,
            'badge_label' => !empty($validated['badge_label']) ? trim($validated['badge_label']) : null,
            'status' => $validated['status'] ?? 'Aktif (Tampil)',
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $data['image'] = '/storage/' . $path;
        } elseif ($request->has('image') && empty($request->input('image'))) {
            $data['image'] = null;
        }

        $post->update($data);

        return back()->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroyPost($id): RedirectResponse
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return back()->with('success', 'Konten berhasil dihapus.');
    }
}
