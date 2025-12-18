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
    server: {
      proxy: {
        // Proxy Inertia XHR requests to Laravel
        '/app': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          bypass: (req) => {
            // Only proxy if it's an Inertia request (XHR with X-Inertia header)
            if (req.headers['x-inertia']) {
              return null // proxy this request
            }
            return req.url // don't proxy, let Astro handle it
          },
        },
      },
    },
  },
})


