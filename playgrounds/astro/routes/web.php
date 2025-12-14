<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Routes for the Astro + Inertia playground. All routes are prefixed with /app
| to match the Astro catch-all route at src/pages/app/[...path].astro
|
*/

// App home
Route::get('/app', function () {
    return inertia('Home');
});

Route::get('/app/', function () {
    return inertia('Home');
});

// Users list
Route::get('/app/users', function () {
    sleep(1); // Simulate latency

    return inertia('Users', [
        'date' => now()->toDateTimeString(),
        'users' => collect([
            ['id' => 1, 'name' => 'Jonathan Reinink', 'email' => 'jonathan@example.com'],
            ['id' => 2, 'name' => 'Adam Wathan', 'email' => 'adam@example.com'],
            ['id' => 3, 'name' => 'Taylor Otwell', 'email' => 'taylor@example.com'],
            ['id' => 4, 'name' => 'Jordan Pittman', 'email' => 'jordan@example.com'],
            ['id' => 5, 'name' => 'Jess Archer', 'email' => 'jess@example.com'],
            ['id' => 6, 'name' => 'Claudio Dekker', 'email' => 'claudio@example.com'],
            ['id' => 7, 'name' => 'Sebastian De Deyne', 'email' => 'sebastian@example.com'],
            ['id' => 8, 'name' => 'Pedro Borges', 'email' => 'pedro@example.com'],
        ])->shuffle()->values(),
    ]);
});

// Article
Route::get('/app/article', function () {
    return inertia('Article');
});

// Form demo
Route::get('/app/form', function () {
    return inertia('Form');
});

// Deferred props demo
Route::get('/app/defer', function () {
    return inertia('Defer', [
        'users' => Inertia::defer(function () {
            sleep(1);

            return [
                ['id' => 1, 'name' => 'Jonathan Reinink', 'email' => 'jonathan@example.com'],
                ['id' => 2, 'name' => 'Taylor Otwell', 'email' => 'taylor@example.com'],
                ['id' => 3, 'name' => 'Joe Tannenbaum', 'email' => 'joe@example.com'],
            ];
        }, 'users'),
        'foods' => Inertia::defer(function () {
            sleep(3);

            return [
                ['id' => 1, 'name' => 'Pizza'],
                ['id' => 2, 'name' => 'Tacos'],
                ['id' => 3, 'name' => 'Sushi'],
            ];
        }, 'foods'),
        'organizations' => Inertia::defer(function () {
            sleep(2);

            return [
                ['id' => 1, 'name' => 'InertiaJS', 'url' => 'https://inertiajs.com'],
                ['id' => 2, 'name' => 'Laravel', 'url' => 'https://laravel.com'],
                ['id' => 3, 'name' => 'VueJS', 'url' => 'https://vuejs.org'],
            ];
        }, 'organizations'),
    ]);
});

// Polling demo
Route::get('/app/poll', function () {
    return inertia('Poll', [
        'users' => collect([
            'Jonathan Reinink',
            'Taylor Otwell',
            'Joe Tannenbaum',
            'Jess Archer',
            'Claudio Dekker',
            'Sebastian De Deyne',
            'Pedro Borges',
        ])->shuffle()->take(3)->values(),
        'companies' => collect([
            'InertiaJS',
            'Laravel',
            'VueJS',
            'Tailwind CSS',
            'AlpineJS',
            'Livewire',
            'Spatie',
        ])->shuffle()->take(3)->values(),
    ]);
});

// Login page
Route::get('/app/login', function () {
    return inertia('Login');
})->name('login');

// Logout (redirects to login)
Route::post('/app/logout', function () {
    return redirect('/app/login');
});
