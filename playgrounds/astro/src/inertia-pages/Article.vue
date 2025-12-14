<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Article" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-slate-900">Article</h1>
      <Link
        href="/app"
        class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        &larr; Back
      </Link>
    </div>

    <article class="prose prose-slate max-w-none rounded-lg bg-white p-8 shadow">
      <h2>The Modern Monolith</h2>
      <p>
        Inertia.js allows you to build modern single-page applications using classic
        server-side routing and controllers. It's a new approach to building web apps
        that lets you create fully client-side rendered, single-page apps without
        the complexity of a modern SPA.
      </p>

      <h3>How Inertia Works</h3>
      <p>
        Inertia works by intercepting link clicks and form submissions and making
        those requests using XHR instead of a full page load. The server responds
        with JSON instead of HTML, and Inertia swaps the page component on the
        client side.
      </p>

      <h3>The Astro Integration</h3>
      <p>
        With the Astro integration, you get the best of both worlds: static,
        SEO-optimized pages for marketing content, and a dynamic SPA experience
        for your authenticated application sections.
      </p>

      <blockquote>
        "Build modern apps the simple way."
      </blockquote>

      <p id="far-down" class="mt-96 rounded-lg bg-yellow-100 p-4">
        <strong>You scrolled!</strong> This section has an ID of "far-down" and can
        be linked to directly using URL fragments.
      </p>
    </article>
  </div>
</template>
