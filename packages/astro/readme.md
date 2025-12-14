# @inertiajs/astro

Use Inertia.js as an island within Astro. Astro owns the page shell (layout, header, footer), while Inertia handles the interactive application region.

## Installation

```bash
npm install @inertiajs/astro
# or
pnpm add @inertiajs/astro
```

You'll also need the Inertia adapter for your chosen framework:

```bash
# For React
npm install @inertiajs/react react react-dom

# For Vue
npm install @inertiajs/vue3 vue

# For Svelte
npm install @inertiajs/svelte svelte
```

## Setup

### 1. Configure the Astro Integration

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import inertia from '@inertiajs/astro'
import react from '@astrojs/react' // or vue/svelte

export default defineConfig({
  integrations: [
    react(), // Required for your chosen framework
    inertia({
      framework: 'react', // 'react' | 'vue' | 'svelte'
      laravelUrl: 'http://localhost:8000', // Your Laravel backend URL
    }),
  ],
})
```

### 2. Create Your App Layout

```astro
---
// src/layouts/AppLayout.astro
import InertiaIsland from '@inertiajs/astro/InertiaIsland.astro'
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <Header />
    <main>
      <InertiaIsland fallback="Loading..." />
    </main>
    <Footer />
  </body>
</html>
```

### 3. Create a Catch-All Route for App Pages

```astro
---
// src/pages/app/[...path].astro
import AppLayout from '../../layouts/AppLayout.astro'
---

<AppLayout />

<script>
  import { initInertia } from '@inertiajs/astro/client/react'
  // or: import { initInertia } from '@inertiajs/astro/client/vue'
  // or: import { initInertia } from '@inertiajs/astro/client/svelte'

  initInertia({
    resolve: (name) => {
      const pages = import.meta.glob('./inertia-pages/**/*.tsx', { eager: true })
      return pages[`./inertia-pages/${name}.tsx`]
    },
  })
</script>
```

### 4. Create Your Inertia Page Components

```tsx
// src/pages/app/inertia-pages/Dashboard.tsx
import { Head, Link } from '@inertiajs/react'

interface Props {
  user: { name: string }
  stats: { visits: number }
}

export default function Dashboard({ user, stats }: Props) {
  return (
    <>
      <Head title="Dashboard" />
      <div>
        <h1>Welcome, {user.name}!</h1>
        <p>You have {stats.visits} visits.</p>
        <Link href="/app/settings">Go to Settings</Link>
      </div>
    </>
  )
}
```

## Configuration Options

### Integration Options

```ts
inertia({
  // Required: The frontend framework to use
  framework: 'react' | 'vue' | 'svelte',

  // The base URL of your Laravel backend
  // Default: '' (same origin)
  laravelUrl: 'http://localhost:8000',

  // Include credentials (cookies) in requests
  // Default: true
  includeCredentials: true,

  // Progress bar configuration
  // Set to false to disable
  progress: {
    delay: 250,
    color: '#29d',
    includeCSS: true,
    showSpinner: false,
  },
})
```

### InertiaIsland Component Props

```astro
<InertiaIsland
  id="app"           <!-- Mount element ID (default: 'app') -->
  class="my-class"   <!-- CSS class for the container -->
  fallback="Loading..." <!-- Loading text/content -->
/>
```

### Client Initialization Options

```ts
initInertia({
  // Mount element ID (default: 'app')
  id: 'app',

  // Component resolver (required)
  resolve: (name) => import(`./pages/${name}.tsx`),

  // Override Laravel URL from integration config
  laravelUrl: 'http://localhost:8000',

  // Override credentials setting
  includeCredentials: true,

  // Progress bar config (overrides integration config)
  progress: { color: 'red' },

  // Title callback
  title: (title) => `${title} - My App`,

  // Pre-fetched initial page data (skip initial fetch)
  initialPage: { component: 'Dashboard', props: {...}, ... },
})
```

## Laravel Configuration

### CORS Setup

If your Astro frontend and Laravel backend are on different domains, configure CORS:

```php
// config/cors.php
return [
    'paths' => ['*'],
    'allowed_origins' => ['http://localhost:4321'], // Astro dev server
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

### Inertia Middleware

Ensure your Laravel routes use the Inertia middleware:

```php
// routes/web.php
Route::middleware(['web', 'inertia'])->prefix('app')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
});
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Astro Shell                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                    Header                        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              InertiaIsland                       │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │     React/Vue/Svelte Component          │    │   │
│  │  │     (fetched from Laravel)              │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │                    Footer                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Flow:**

1. User visits `/app/dashboard`
2. Astro serves the static shell (header, nav, footer)
3. Client-side JavaScript initializes Inertia
4. Inertia fetches page data from Laravel via XHR
5. The component hydrates inside the island
6. Subsequent navigation uses Inertia's SPA router

## Use Cases

This integration is ideal for:

- **Hybrid applications**: Marketing pages, docs, and blog in Astro; app dashboard in Inertia
- **Gradual migration**: Move parts of a Laravel app to Astro while keeping the interactive core
- **SEO + Interactivity**: Static, SEO-optimized pages alongside a dynamic authenticated app

## Framework-Specific Notes

### React

All `@inertiajs/react` features work: `Link`, `useForm`, `usePage`, `Head`, etc.

### Vue

All `@inertiajs/vue3` features work: `Link`, `useForm`, `usePage`, `Head`, etc.

### Svelte

Supports both Svelte 4 and Svelte 5. All `@inertiajs/svelte` features work.

## License

MIT
