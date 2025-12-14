<script setup lang="ts">
import { Head, Link, Deferred } from '@inertiajs/vue3'

interface Item {
  id: number
  name: string
  email?: string
  url?: string
}

defineProps<{
  users?: Item[]
  foods?: Item[]
  organizations?: Item[]
}>()
</script>

<template>
  <Head title="Deferred Props" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Deferred Props</h1>
        <p class="mt-1 text-sm text-slate-500">
          These sections load asynchronously after the initial page render.
        </p>
      </div>
      <Link
        href="/app"
        class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        &larr; Back
      </Link>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <!-- Users (deferred) -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="text-lg font-semibold text-slate-900">Users</h2>
        <p class="text-xs text-slate-500">Loads in ~1 second</p>
        <Deferred data="users">
          <template #fallback>
            <div class="mt-4 animate-pulse space-y-2">
              <div class="h-4 w-3/4 rounded bg-slate-200" />
              <div class="h-4 w-1/2 rounded bg-slate-200" />
              <div class="h-4 w-2/3 rounded bg-slate-200" />
            </div>
          </template>
          <ul class="mt-4 space-y-2">
            <li v-for="user in users" :key="user.id" class="text-sm text-slate-600">
              {{ user.name }}
            </li>
          </ul>
        </Deferred>
      </div>

      <!-- Organizations (deferred) -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="text-lg font-semibold text-slate-900">Organizations</h2>
        <p class="text-xs text-slate-500">Loads in ~2 seconds</p>
        <Deferred data="organizations">
          <template #fallback>
            <div class="mt-4 animate-pulse space-y-2">
              <div class="h-4 w-3/4 rounded bg-slate-200" />
              <div class="h-4 w-1/2 rounded bg-slate-200" />
              <div class="h-4 w-2/3 rounded bg-slate-200" />
            </div>
          </template>
          <ul class="mt-4 space-y-2">
            <li v-for="org in organizations" :key="org.id" class="text-sm">
              <a :href="org.url" target="_blank" class="text-indigo-600 hover:underline">
                {{ org.name }}
              </a>
            </li>
          </ul>
        </Deferred>
      </div>

      <!-- Foods (deferred) -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="text-lg font-semibold text-slate-900">Foods</h2>
        <p class="text-xs text-slate-500">Loads in ~3 seconds</p>
        <Deferred data="foods">
          <template #fallback>
            <div class="mt-4 animate-pulse space-y-2">
              <div class="h-4 w-3/4 rounded bg-slate-200" />
              <div class="h-4 w-1/2 rounded bg-slate-200" />
              <div class="h-4 w-2/3 rounded bg-slate-200" />
            </div>
          </template>
          <ul class="mt-4 space-y-2">
            <li v-for="food in foods" :key="food.id" class="text-sm text-slate-600">
              {{ food.name }}
            </li>
          </ul>
        </Deferred>
      </div>
    </div>

    <div class="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-800">
      <strong>How it works:</strong> Deferred props are loaded after the initial page render.
      The server immediately returns the page with placeholder data, then Inertia fetches
      the deferred props in a separate request.
    </div>
  </div>
</template>
