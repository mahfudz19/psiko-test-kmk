<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MajorCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MajorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $majors = Major::with('majorCategory')->get();
        $categories = MajorCategory::withCount('majors')->get();
        $savedMajorIds = $user ? $user->savedMajors()->pluck('majors.id')->toArray() : [];

        return Inertia::render('Student/Jurusan', [
            'majors' => $majors,
            'categories' => $categories,
            'savedMajorIds' => $savedMajorIds,
        ]);
    }

    public function toggleBookmark(Request $request, int $id): RedirectResponse
    {
        $user = $request->user();
        $major = Major::findOrFail($id);

        if ($user->savedMajors()->where('major_id', $major->id)->exists()) {
            $user->savedMajors()->detach($major->id);
            $message = "Jurusan {$major->title} dihapus dari daftar simpan.";
        } else {
            $user->savedMajors()->attach($major->id);
            $message = "Jurusan {$major->title} berhasil disimpan ke daftar eksplorasi.";
        }

        return back()->with('success', $message);
    }
}
