<?php

namespace App\Http\Controllers;

use App\Models\Major;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Scholarship;
use App\Models\StudyProgram;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $testimonials = Testimonial::with('user:id,name,avatar')->where('is_published', true)->latest()->get();
        $studyPrograms = StudyProgram::with('category')->where('status', 'Aktif (Tampil)')->get();
        $scholarships = Scholarship::with('category')->where('status', 'Aktif (Tampil)')->latest()->take(2)->get();

        $webinar = Post::with('category')->where('type', 'webinar')->where('status', 'Aktif (Tampil)')->latest()->first();
        $announcements = Post::with('category')->where('type', 'pengumuman')->where('status', 'Aktif (Tampil)')->latest()->take(3)->get();
        $news = Post::with('category')->where('type', 'berita')->where('status', 'Aktif (Tampil)')->latest()->take(3)->get();

        return Inertia::render('Landing', [
            'majors' => $majors,
            'testimonials' => $testimonials,
            'studyPrograms' => $studyPrograms,
            'scholarships' => $scholarships,
            'webinar' => $webinar,
            'announcements' => $announcements,
            'news' => $news,
        ]);
    }

    public function beasiswaList(Request $request): Response
    {
        $query = Scholarship::with('category')->where('status', 'Aktif (Tampil)')->latest();

        if ($request->filled('q')) {
            $keyword = '%' . strtolower($request->query('q')) . '%';
            $query->where(function ($q) use ($keyword) {
                $q->whereRaw('LOWER(name) LIKE ?', [$keyword])
                  ->orWhereRaw('LOWER(organizer) LIKE ?', [$keyword])
                  ->orWhereRaw('LOWER(tag) LIKE ?', [$keyword]);
            });
        }

        if ($request->filled('tag') && $request->query('tag') !== 'Semua') {
            $tag = $request->query('tag');
            $query->where(function ($q) use ($tag) {
                $q->where('tag', $tag)
                  ->orWhereHas('category', fn($cq) => $cq->where('name', $tag));
            });
        }

        $scholarships = $query->get();
        $categories = \App\Models\ScholarshipCategory::all();
        $allTags = $categories->pluck('name')->merge(Scholarship::where('status', 'Aktif (Tampil)')->pluck('tag'))->unique()->filter()->values();

        return Inertia::render('Beasiswa', [
            'scholarships' => $scholarships,
            'categories' => $categories,
            'allTags' => $allTags,
            'filters' => [
                'q' => $request->query('q', ''),
                'tag' => $request->query('tag', 'Semua'),
            ],
        ]);
    }

    public function beritaList(Request $request): Response
    {
        $query = Post::with('category')->where('status', 'Aktif (Tampil)')->latest();

        $selectedType = $request->query('type', 'semua');
        if (!empty($selectedType) && $selectedType !== 'semua') {
            $query->where('type', $selectedType);
        }

        if ($request->filled('q')) {
            $keyword = '%' . strtolower($request->query('q')) . '%';
            $query->where(function ($q) use ($keyword) {
                $q->whereRaw('LOWER(title) LIKE ?', [$keyword])
                  ->orWhereRaw('LOWER(excerpt) LIKE ?', [$keyword])
                  ->orWhereHas('category', fn($cq) => $cq->whereRaw('LOWER(name) LIKE ?', [$keyword]));
            });
        }

        $effectiveKategori = 'Semua';
        if ($selectedType === 'berita') {
            $effectiveKategori = $request->query('kategori', 'Semua');
            if (!empty($effectiveKategori) && $effectiveKategori !== 'Semua') {
                $kat = $effectiveKategori;
                $query->whereHas('category', fn($cq) => $cq->where('slug', $kat)->orWhere('name', $kat));
            }
        }

        $posts = $query->get();
        $categories = PostCategory::all();

        return Inertia::render('Berita', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => [
                'q' => $request->query('q', ''),
                'type' => $selectedType,
                'kategori' => $effectiveKategori,
            ],
        ]);
    }

    public function beritaDetail(string $slug): Response
    {
        $decodedSlug = urldecode($slug);

        $postQuery = Post::with('category')
            ->where(function ($q) use ($slug, $decodedSlug) {
                $q->where('slug', $slug)
                  ->orWhere('slug', $decodedSlug)
                  ->orWhereRaw('LOWER(slug) = ?', [strtolower($decodedSlug)])
                  ->orWhere('id', is_numeric($slug) ? (int)$slug : 0);
            });

        if (!Auth::check() || Auth::user()->role !== 'admin') {
            $postQuery->where('status', 'Aktif (Tampil)');
        }

        $post = $postQuery->first();

        if (!$post) {
            $anyPost = Post::with('category')
                ->where(function ($q) use ($slug, $decodedSlug) {
                    $q->where('slug', $slug)
                      ->orWhere('slug', $decodedSlug)
                      ->orWhereRaw('LOWER(slug) = ?', [strtolower($decodedSlug)])
                      ->orWhere('id', is_numeric($slug) ? (int)$slug : 0);
                })
                ->first();

            if ($anyPost && Auth::check() && Auth::user()->role === 'admin') {
                $post = $anyPost;
            }
        }

        $relatedPosts = collect();
        if ($post) {
            $relatedPosts = Post::with('category')
                ->where('id', '!=', $post->id)
                ->where('status', 'Aktif (Tampil)')
                ->where('type', $post->type)
                ->latest()
                ->take(3)
                ->get();

            if ($relatedPosts->isEmpty()) {
                $relatedPosts = Post::with('category')
                    ->where('id', '!=', $post->id)
                    ->where('status', 'Aktif (Tampil)')
                    ->latest()
                    ->take(3)
                    ->get();
            }
        } else {
            $relatedPosts = Post::with('category')
                ->where('status', 'Aktif (Tampil)')
                ->latest()
                ->take(3)
                ->get();
        }

        return Inertia::render('BeritaDetail', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
