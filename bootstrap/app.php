<?php

use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'role' => EnsureRole::class,
        ]);
        $middleware->redirectUsersTo(function (Request $request) {
            $user = $request->user();
            return match ($user?->role) {
                'admin' => '/admin/dashboard',
                'guru' => '/guru/dashboard',
                default => '/student/dashboard',
            };
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (!$request->is('api/*') && !$request->expectsJson()) {
                return Inertia::render('Error/NotFound')->toResponse($request)->setStatusCode(404);
            }
        });
    })->create();
