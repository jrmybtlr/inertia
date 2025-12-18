<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Home" />

  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Welcome to the App</h1>
      <p class="mt-2 text-slate-600">
        You're now inside the Inertia-powered section of the application.
        This Vue component was fetched from your Laravel backend.
      </p>
    </div>

    <div class="rounded-lg bg-white p-6 shadow">
      <h2 class="text-xl font-semibold text-slate-900">Navigation</h2>
      <p class="mt-2 text-sm text-slate-500">
        These links use Inertia's SPA navigation - no full page reloads!
      </p>
      <nav class="mt-4 flex flex-wrap gap-3">
        <Link
          href="/app/users"
          class="rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200 transition-colors"
          prefetch
        >
          Users
        </Link>
        <Link
          href="/app/article"
          class="rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200 transition-colors"
          prefetch
        >
          Article
        </Link>
        <Link
          href="/app/form"
          class="rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200 transition-colors"
        >
          Form Demo
        </Link>
        <Link
          href="/app/defer"
          class="rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200 transition-colors"
        >
          Deferred Props
        </Link>
        <Link
          href="/app/poll"
          class="rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200 transition-colors"
        >
          Polling
        </Link>
      </nav>
    </div>

    <div class="rounded-lg bg-slate-100 p-6">
      <h2 class="text-xl font-semibold text-slate-900">How It Works</h2>
      <ul class="mt-4 space-y-2 text-slate-600">
        <li class="flex items-start gap-2">
          <span class="text-indigo-600">1.</span>
          <span>Astro serves the static shell (header, footer, this container)</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-indigo-600">2.</span>
          <span>The InertiaIsland initializes and fetches page data from Laravel</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-indigo-600">3.</span>
          <span>This Vue component renders inside the island</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-indigo-600">4.</span>
          <span>Inertia's router handles navigation without full page reloads</span>
        </li>
      </ul>
    </div>

    <div class="flex gap-4">
      <button
        type="button"
        @click="router.clearHistory()"
        class="rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300 transition-colors"
      >
        Clear History
      </button>
      <a
        href="/"
        class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        Back to Marketing Site (full reload)
      </a>
    </div>
  </div>
</template>
