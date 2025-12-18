<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * For Astro integration, we exclude all routes since Astro handles the frontend
     * and makes cross-origin requests to Laravel.
     *
     * @var array<int, string>
     */
    protected $except = [
        '*',
    ];
}


