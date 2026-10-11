<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CampusLifeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Student/SimulasiKuliah');
    }
}
