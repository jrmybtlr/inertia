<script setup lang="ts">
import { Head, Link, usePoll } from '@inertiajs/vue3'
import { ref } from 'vue'

defineProps<{
  users: string[]
  companies: string[]
}>()

const pollInterval = ref(2000)
const { start, stop, polling } = usePoll(pollInterval.value, {
  only: ['users', 'companies'],
  autoStart: false,
})
</script>

<template>
  <Head title="Polling" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Polling Demo</h1>
        <p class="mt-1 text-sm text-slate-500">
          Data automatically refreshes at the configured interval.
        </p>
      </div>
      <Link
        href="/app"
        class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        &larr; Back
      </Link>
    </div>

    <div class="flex items-center gap-4">
      <button
        v-if="!polling"
        @click="start"
        class="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors"
      >
        Start Polling
      </button>
      <button
        v-else
        @click="stop"
        class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
      >
        Stop Polling
      </button>
      <span
        :class="[
          'flex items-center gap-2 rounded-full px-3 py-1 text-sm',
          polling ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600',
        ]"
      >
        <span :class="['h-2 w-2 rounded-full', polling ? 'animate-pulse bg-green-500' : 'bg-slate-400']" />
        {{ polling ? 'Polling active' : 'Polling stopped' }}
      </span>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="text-lg font-semibold text-slate-900">Random Users</h2>
        <ul class="mt-4 space-y-2">
          <li v-for="(user, index) in users" :key="index" class="text-slate-600">
            {{ user }}
          </li>
        </ul>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="text-lg font-semibold text-slate-900">Random Companies</h2>
        <ul class="mt-4 space-y-2">
          <li v-for="(company, index) in companies" :key="index" class="text-slate-600">
            {{ company }}
          </li>
        </ul>
      </div>
    </div>

    <div class="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-800">
      <strong>How it works:</strong> The usePoll hook automatically reloads specified props
      at the given interval. The server returns shuffled data each time, so you'll see
      the lists update when polling is active.
    </div>
  </div>
</template>
