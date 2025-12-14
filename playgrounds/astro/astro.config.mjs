import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vue from '@astrojs/vue'
import inertia from '@inertiajs/astro'

export default defineConfig({
  integrations: [
    vue(),
    inertia({
      framework: 'vue',
      laravelUrl: 'http://localhost:8000',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
