<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Guru\MentoringController as GuruMentoringController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Student\CampusLifeController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\MajorController as StudentMajorController;
use App\Http\Controllers\Student\MentoringController as StudentMentoringController;
use App\Http\Controllers\Student\PmbController as StudentPmbController;
use App\Http\Controllers\Student\ProfileController as StudentProfileController;
use App\Http\Controllers\Student\RiasecController as StudentRiasecController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/beasiswa', [LandingController::class, 'beasiswaList'])->name('beasiswa.public');
Route::get('/berita', [LandingController::class, 'beritaList'])->name('berita.public');
Route::get('/berita/{slug}', [LandingController::class, 'beritaDetail'])->name('berita.detail');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
    Route::get('/demo-login/{role}', [AuthController::class, 'demoLogin'])->name('demo.login');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
Route::post('/testimonials', [AdminDashboardController::class, 'storeFeedback'])->name('testimonials.user_store')->middleware('auth');
Route::get('/api/testimonials/published', function () {
    return response()->json(\App\Models\Testimonial::with('user:id,name,avatar')->where('is_published', true)->latest()->get());
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::match(['patch', 'post'], '/testimonials/{id}/publish', [AdminDashboardController::class, 'togglePublishTestimonial']);
    Route::match(['put', 'post'], '/testimonials/{id}', [AdminDashboardController::class, 'updateTestimonial']);
    Route::delete('/testimonials/{id}', [AdminDashboardController::class, 'destroyTestimonial']);
});

Route::prefix('student')->name('student.')->middleware(['auth', 'role:siswa'])->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/riasec', [StudentRiasecController::class, 'index'])->name('riasec');
    Route::post('/riasec', [StudentRiasecController::class, 'store'])->name('riasec.store');
    Route::post('/riasec/start', [StudentRiasecController::class, 'start'])->name('riasec.start');
    Route::post('/riasec/complete', [StudentRiasecController::class, 'complete'])->name('riasec.complete');
    Route::post('/riasec/reset', [StudentRiasecController::class, 'reset'])->name('riasec.reset');
    Route::get('/jurusan', [StudentMajorController::class, 'index'])->name('jurusan');
    Route::post('/jurusan/{id}/bookmark', [StudentMajorController::class, 'toggleBookmark'])->name('jurusan.bookmark');
    Route::get('/simulasi-pmb', [StudentPmbController::class, 'index'])->name('simulasi-pmb');
    Route::get('/simulasi-kuliah', [CampusLifeController::class, 'index'])->name('simulasi-kuliah');
    Route::get('/booking', [StudentMentoringController::class, 'index'])->name('booking');
    Route::post('/booking', [StudentMentoringController::class, 'store'])->name('booking.store');
    Route::get('/profile', [StudentProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [StudentProfileController::class, 'update'])->name('profile.update');
});

Route::prefix('guru')->name('guru.')->middleware(['auth', 'role:guru'])->group(function () {
    Route::get('/dashboard', [GuruDashboardController::class, 'index'])->name('dashboard');
    Route::get('/monitoring', [GuruDashboardController::class, 'monitoring'])->name('monitoring');
    Route::get('/sesi-mentoring', [GuruMentoringController::class, 'index'])->name('sesi');
    Route::patch('/sesi-mentoring/{id}', [GuruMentoringController::class, 'updateStatus'])->name('sesi.status');
    Route::get('/profile', [GuruDashboardController::class, 'profile'])->name('profile');
    Route::post('/profile', [GuruDashboardController::class, 'updateProfile'])->name('profile.update');
});

Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [AdminDashboardController::class, 'users'])->name('users');
    Route::post('/users', [AdminDashboardController::class, 'storeUser'])->name('users.store');
    Route::put('/users/{id}', [AdminDashboardController::class, 'updateUser'])->name('users.update');
    Route::patch('/users/{id}/status', [AdminDashboardController::class, 'toggleUserStatus'])->name('users.status');
    Route::get('/input-test', [AdminDashboardController::class, 'inputTest'])->name('input_test');
    Route::post('/input-test', [AdminDashboardController::class, 'storeTest'])->name('input_test.store');
    Route::put('/input-test/{id}', [AdminDashboardController::class, 'updateTest'])->name('input_test.update');
    Route::delete('/input-test/{id}', [AdminDashboardController::class, 'destroyTest'])->name('input_test.destroy');
    Route::get('/input-jurusan', [AdminDashboardController::class, 'inputJurusan'])->name('input_jurusan');
    Route::post('/input-jurusan', [AdminDashboardController::class, 'storeJurusan'])->name('input_jurusan.store');
    Route::put('/input-jurusan/{id}', [AdminDashboardController::class, 'updateJurusan'])->name('input_jurusan.update');
    Route::delete('/input-jurusan/{id}', [AdminDashboardController::class, 'destroyJurusan'])->name('input_jurusan.destroy');
    Route::post('/kategori-jurusan', [AdminDashboardController::class, 'storeCategory'])->name('kategori_jurusan.store');
    Route::put('/kategori-jurusan/{id}', [AdminDashboardController::class, 'updateCategory'])->name('kategori_jurusan.update');
    Route::get('/monitoring-tes', [AdminDashboardController::class, 'monitoringTes'])->name('monitoring_tes');
    Route::post('/monitoring-tes/import', [AdminDashboardController::class, 'importScores'])->name('monitoring_tes.import');
    Route::post('/monitoring-tes/sync-spreadsheet', [AdminDashboardController::class, 'syncSpreadsheet'])->name('monitoring_tes.sync_spreadsheet');
    Route::put('/monitoring-tes/{id}', [AdminDashboardController::class, 'updateStudentScore'])->name('monitoring_tes.update');
    Route::get('/monitoring-testimoni', [AdminDashboardController::class, 'monitoringTestimoni'])->name('monitoring_testimoni');
    Route::post('/testimonials', [AdminDashboardController::class, 'storeTestimonial'])->name('testimonials.admin_store');
    Route::match(['put', 'post'], '/testimonials/{id}', [AdminDashboardController::class, 'updateTestimonial'])->name('testimonials.update');
    Route::match(['patch', 'post'], '/testimonials/{id}/publish', [AdminDashboardController::class, 'togglePublishTestimonial'])->name('testimonials.publish');
    Route::delete('/testimonials/{id}', [AdminDashboardController::class, 'destroyTestimonial'])->name('testimonials.destroy');
    Route::get('/program', [AdminDashboardController::class, 'program'])->name('program');
    Route::post('/program', [AdminDashboardController::class, 'storeProgram'])->name('program.store');
    Route::match(['put', 'post'], '/program/{id}', [AdminDashboardController::class, 'updateProgram'])->name('program.update');
    Route::delete('/program/{id}', [AdminDashboardController::class, 'destroyProgram'])->name('program.destroy');

    Route::post('/program-categories', [AdminDashboardController::class, 'storeProgramCategory'])->name('program_category.store');
    Route::match(['put', 'post'], '/program-categories/{id}', [AdminDashboardController::class, 'updateProgramCategory'])->name('program_category.update');
    Route::delete('/program-categories/{id}', [AdminDashboardController::class, 'destroyProgramCategory'])->name('program_category.destroy');

    Route::post('/upload-editor-image', [AdminDashboardController::class, 'uploadEditorImage'])->name('upload_editor_image');
    Route::get('/beasiswa', [AdminDashboardController::class, 'beasiswa'])->name('beasiswa');
    Route::post('/beasiswa', [AdminDashboardController::class, 'storeScholarship'])->name('beasiswa.store');
    Route::match(['put', 'post'], '/beasiswa/{id}', [AdminDashboardController::class, 'updateScholarship'])->name('beasiswa.update');
    Route::delete('/beasiswa/{id}', [AdminDashboardController::class, 'destroyScholarship'])->name('beasiswa.destroy');
    Route::post('/beasiswa-categories', [AdminDashboardController::class, 'storeScholarshipCategory'])->name('beasiswa_category.store');
    Route::match(['put', 'post'], '/beasiswa-categories/{id}', [AdminDashboardController::class, 'updateScholarshipCategory'])->name('beasiswa_category.update');
    Route::delete('/beasiswa-categories/{id}', [AdminDashboardController::class, 'destroyScholarshipCategory'])->name('beasiswa_category.destroy');
    Route::get('/berita-artikel', [AdminDashboardController::class, 'beritaArtikel'])->name('berita_artikel');
    Route::post('/berita-artikel', [AdminDashboardController::class, 'storePost'])->name('berita_artikel.store');
    Route::match(['put', 'post'], '/berita-artikel/{id}', [AdminDashboardController::class, 'updatePost'])->name('berita_artikel.update');
    Route::delete('/berita-artikel/{id}', [AdminDashboardController::class, 'destroyPost'])->name('berita_artikel.destroy');
    Route::post('/berita-categories', [AdminDashboardController::class, 'storePostCategory'])->name('berita_category.store');
    Route::match(['put', 'post'], '/berita-categories/{id}', [AdminDashboardController::class, 'updatePostCategory'])->name('berita_category.update');
    Route::delete('/berita-categories/{id}', [AdminDashboardController::class, 'destroyPostCategory'])->name('berita_category.destroy');
});

Route::fallback(function () {
    return \Inertia\Inertia::render('Error/NotFound')->toResponse(request())->setStatusCode(404);
});
