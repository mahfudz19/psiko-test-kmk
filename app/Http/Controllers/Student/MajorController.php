<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\MajorCategory;
use Inertia\Inertia;
use Inertia\Response;

class MajorController extends Controller
{
    public function index(): Response
    {
        $majors = Major::with('majorCategory')->get();
        $categories = MajorCategory::withCount('majors')->get();

        return Inertia::render('Student/Jurusan', [
            'majors' => $majors,
            'categories' => $categories,
        ]);
    }
}
