<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
</script>

<template>

  <Head title="Login" />

  <div class="flex min-h-[60vh] items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Sign In</h1>
      <p class="mt-2 text-sm text-slate-500">Welcome back! Please sign in to continue.</p>

      <form class="mt-6 space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
          <input id="email" type="email"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="you@example.com" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
          <input id="password" type="password"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="••••••••" />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded border-slate-300 text-indigo-600" />
            <span class="text-sm text-slate-600">Remember me</span>
          </label>
          <a href="#" class="text-sm text-indigo-600 hover:underline">Forgot password?</a>
        </div>

        <button type="submit"
          class="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors">
          Sign In
        </button>
      </form>

      <div class="mt-6 text-center">
        <Link href="/app" class="text-sm text-indigo-600 hover:underline">
          &larr; Back to App
        </Link>
      </div>
    </div>
  </div>
</template>
