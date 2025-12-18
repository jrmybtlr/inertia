# Inertia Islands - Native Approach

This document describes the **native Inertia island** functionality that allows you to embed Inertia.js applications as independent "islands" within a larger page, without requiring Astro or any other meta-framework.

## What are Inertia Islands?

Inertia Islands allow you to create **hybrid applications** where:
- Parts of your page are static HTML (headers, footers, sidebars)
- Other parts are dynamic Inertia.js applications
- Multiple islands can coexist on the same page
- Each island has its own router and state

This is similar to the [Astro Islands](https://docs.astro.build/en/concepts/islands/) concept, but built directly into Inertia.js itself.

## Use Cases

### 1. Hybrid Marketing + App Pages
Build your marketing site with static HTML/components, while embedding your app dashboard as an Inertia island:

```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <header>
      <!-- Static marketing header -->
      <nav>...</nav>
    </header>
    
    <main>
      <!-- Dynamic Inertia app island -->
      <div id="app-region"></div>
    </main>
    
    <footer>
      <!-- Static marketing footer -->
    </footer>
    
    <script type="module">
      // Initialize the island
    </script>
  </body>
</html>
```

### 2. Gradual Migration
Incrementally migrate existing applications to Inertia:
- Keep existing static pages unchanged
- Embed Inertia islands for new features
- Migrate page by page over time

### 3. Multi-Region Apps
Create applications with multiple independent Inertia regions:
- Different apps/modules in different page regions
- Each with independent routing and state
- Shared static shell around them

## Framework-Specific Usage

### React

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { InertiaIsland } from '@inertiajs/react'

function App() {
  return (
    <div>
      <header>
        <h1>My Static Header</h1>
      </header>

      <main>
        <InertiaIsland
          resolve={(name) => {
            const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
            return pages[`./Pages/${name}.tsx`]
          }}
          url="/app/dashboard"
          fallback={<div>Loading dashboard...</div>}
        />
      </main>

      <footer>
        <p>&copy; 2025 My Company</p>
      </footer>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

### Vue 3

```vue
<template>
  <div>
    <header>
      <h1>My Static Header</h1>
    </header>

    <main>
      <InertiaIsland
        :resolve="resolve"
        url="/app/dashboard"
        fallback="Loading dashboard..."
      />
    </main>

    <footer>
      <p>&copy; 2025 My Company</p>
    </footer>
  </div>
</template>

<script setup>
import { InertiaIsland } from '@inertiajs/vue3'

const resolve = (name) => {
  const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
  return pages[`./Pages/${name}.vue`]
}
</script>
```

### Svelte

```svelte
<script>
  import { InertiaIsland } from '@inertiajs/svelte'

  const resolve = (name) => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  }
</script>

<div>
  <header>
    <h1>My Static Header</h1>
  </header>

  <main>
    <InertiaIsland
      {resolve}
      url="/app/dashboard"
      fallback="Loading dashboard..."
    />
  </main>

  <footer>
    <p>&copy; 2025 My Company</p>
  </footer>
</div>
```

## API Reference

### Props

#### `resolve` (required)
Function that resolves component names to actual component modules.

```typescript
resolve: (name: string) => Component | Promise<Component>
```

**Example:**
```javascript
resolve: (name) => import(`./Pages/${name}.tsx`)
```

#### `url` (optional)
URL to fetch initial page data from. If not provided, uses the current browser URL.

```typescript
url?: string
```

**Example:**
```javascript
url="/app/dashboard"
```

#### `initialPage` (optional)
Pre-fetched initial page data. If provided, skips the initial fetch.

```typescript
initialPage?: Page<Props>
```

**Example:**
```javascript
initialPage={{
  component: 'Dashboard',
  props: { user: { name: 'John' } },
  url: '/app/dashboard',
  version: '1.0.0'
}}
```

#### `id` (optional)
DOM element ID for the island mount point.

```typescript
id?: string
```

**Default:** `'app'`

#### `title` (optional)
Function to transform page titles.

```typescript
title?: (title: string) => string
```

**Example:**
```javascript
title={(title) => `${title} - My App`}
```

#### `fallback` (optional)
Loading indicator shown while the island initializes.

```typescript
fallback?: string | ReactNode | Component
```

**Default:** `'Loading...'`

#### `className` / `class` (optional)
CSS class to apply to the island container.

```typescript
className?: string // React
class?: string     // Vue/Svelte
```

#### `progress` (optional)
Progress bar configuration. Set to `false` to disable.

```typescript
progress?: false | ProgressConfig
```

## Server-Side Setup

Your Laravel backend doesn't need any special configuration. The island fetches data using standard Inertia requests:

```php
Route::get('/app/dashboard', function () {
    return Inertia::render('Dashboard', [
        'user' => auth()->user(),
        'stats' => Stats::get(),
    ]);
});
```

## Advanced: Multiple Islands

You can have multiple independent islands on the same page:

```tsx
<div>
  <header>Static Header</header>

  <div style={{ display: 'flex' }}>
    <aside>
      <InertiaIsland
        id="sidebar"
        resolve={resolveSidebarPages}
        url="/app/sidebar"
      />
    </aside>

    <main>
      <InertiaIsland
        id="main-content"
        resolve={resolveMainPages}
        url="/app/dashboard"
      />
    </main>
  </div>

  <footer>Static Footer</footer>
</div>
```

**Important:** When using multiple islands, provide unique `id` props for each.

## Comparison with Astro Integration

| Feature | Native Islands | Astro Integration |
|---------|---------------|-------------------|
| Framework Required | None (just React/Vue/Svelte) | Astro |
| Setup Complexity | Simple | Medium |
| Static Shell | Manual HTML/Components | Astro components |
| SSR Support | No | Yes (via Astro) |
| Use Case | Hybrid SPA apps | Static-first sites |

## Performance Considerations

### Initial Page Load
- The island fetches its data from the server on mount
- Use the `initialPage` prop to avoid the extra request if you can inline the data
- The `fallback` prop provides immediate visual feedback

### Caching
Islands respect standard Inertia caching mechanisms:
- Browser navigation cache
- Prefetching support
- Asset versioning

### Bundle Size
The island component adds minimal overhead (~2KB gzipped) beyond standard Inertia.

## Limitations

1. **No SSR**: Islands render client-side only. For SSR, use the Astro integration or standard Inertia.
2. **Single Router**: Only one router instance per page. Multiple islands share the same router.
3. **Session Sharing**: All islands share the same browser session and cookies.

## Migration Guide

### From Astro Islands

If you're using `@inertiajs/astro` and want to switch to native islands:

**Before (Astro):**
```astro
---
import InertiaIsland from '@inertiajs/astro/InertiaIsland.astro'
---

<Layout>
  <InertiaIsland fallback="Loading..." />
</Layout>

<script>
  import { initInertia } from '@inertiajs/astro/client/react'
  initInertia({ resolve: ... })
</script>
```

**After (Native):**
```tsx
import { InertiaIsland } from '@inertiajs/react'

function App() {
  return (
    <Layout>
      <InertiaIsland resolve={...} fallback="Loading..." />
    </Layout>
  )
}
```

### From Standard Inertia

If you have a standard Inertia app and want to add static regions:

**Before:**
```tsx
import { createInertiaApp } from '@inertiajs/react'

createInertiaApp({
  resolve: (name) => import(`./Pages/${name}.tsx`),
  setup({ el, App, props }) {
    ReactDOM.createRoot(el).render(<App {...props} />)
  },
})
```

**After:**
```tsx
import { InertiaIsland } from '@inertiajs/react'

function App() {
  return (
    <>
      <Header /> {/* Now static */}
      <InertiaIsland resolve={(name) => import(`./Pages/${name}.tsx`)} />
      <Footer /> {/* Now static */}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

## Troubleshooting

### Island doesn't load
- Check browser console for errors
- Verify the `resolve` function returns valid components
- Ensure your Laravel routes return Inertia responses with correct headers

### Multiple islands conflict
- Ensure each island has a unique `id` prop
- Check that routes don't overlap

### Slow initial load
- Use the `initialPage` prop to inline initial data
- Consider implementing a loading skeleton in the `fallback` prop
- Check network tab for slow backend responses

## Examples

See the `examples/` directory for complete working examples:
- `examples/react-island/` - React with static header/footer
- `examples/vue-island/` - Vue 3 hybrid app
- `examples/svelte-island/` - Svelte multi-region app

## License

MIT
