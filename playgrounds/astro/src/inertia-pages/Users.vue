<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'

interface User {
  id: number
  name: string
  email: string
}

defineProps<{
  date: string
  users: User[]
}>()
</script>

<template>
  <Head title="Users" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Users</h1>
        <p class="mt-1 text-sm text-slate-500">Last updated: {{ date }}</p>
      </div>
      <Link
        href="/app"
        class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        &larr; Back
      </Link>
    </div>

    <div class="rounded-lg bg-white shadow overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
              {{ user.id }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
              {{ user.name }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
              {{ user.email }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-800">
      <strong>Note:</strong> This data was fetched from your Laravel backend.
      The user list is shuffled on each request to demonstrate dynamic data.
    </div>
  </div>
</template>
