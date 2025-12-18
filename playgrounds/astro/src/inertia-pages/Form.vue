<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'

const form = useForm({
  name: '',
  email: '',
  message: '',
})

function submit() {
  // In a real app, this would POST to Laravel
  alert(`Form submitted!\n\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`)
  form.reset()
}
</script>

<template>

  <Head title="Form Demo" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-slate-900">Form Demo</h1>
      <Link href="/app"
        class="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
        &larr; Back
      </Link>
    </div>

    <div class="max-w-xl rounded-lg bg-white p-8 shadow">
      <h2 class="text-xl font-semibold text-slate-900">Contact Form</h2>
      <p class="mt-2 text-sm text-slate-500">
        This demonstrates Inertia's useForm helper for handling form state.
      </p>

      <form @submit.prevent="submit" class="mt-6 space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700">Name</label>
          <input id="name" v-model="form.name" type="text"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your name" />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
          <input id="email" v-model="form.email" type="email"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="you@example.com" />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-slate-700">Message</label>
          <textarea id="message" v-model="form.message" rows="4"
            class="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your message..." />
        </div>

        <div class="flex items-center justify-between pt-4">
          <button type="button" @click="form.reset()" class="text-sm text-slate-500 hover:text-slate-700">
            Reset form
          </button>
          <button type="submit" :disabled="form.processing"
            class="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {{ form.processing ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>

      <div class="mt-6 rounded-lg bg-slate-100 p-4">
        <h3 class="text-sm font-medium text-slate-700">Form State</h3>
        <pre class="mt-2 text-xs text-slate-600">{{ JSON.stringify(form.data(), null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
