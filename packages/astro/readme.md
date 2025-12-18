# @inertiajs/astro

The Astro adapter for Inertia.js - Use Inertia as an island within Astro.

## Installation

```bash
npm install @inertiajs/astro
# or
pnpm add @inertiajs/astro
# or
yarn add @inertiajs/astro
```

## Setup

### 1. Configure Astro Integration

Add the Inertia integration to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import inertia from '@inertiajs/astro'

export default defineConfig({
  integrations: [
    inertia({
      framework: 'vue', // or 'react', 'svelte'
      laravelUrl: 'http://localhost:8000',
    }),
  ],
})
```

### 2. Add InertiaIsland to Your Layout

In your Astro page or layout:

```astro
---
import Layout from '../layouts/Layout.astro'
import InertiaIsland from '@inertiajs/astro/InertiaIsland.astro'
---

<Layout>
  <InertiaIsland fallback="Loading..." />
</Layout>
```

### 3. Initialize Inertia Client-Side

Create a client-side script to initialize Inertia:

#### Vue Example

```ts
// src/client/app.ts
import { initInertia } from '@inertiajs/astro/client/vue'

initInertia({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    return pages[`../pages/${name}.vue`]
  },
})
```

#### React Example

```ts
// src/client/app.ts
import { initInertia } from '@inertiajs/astro/client/react'

initInertia({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    return pages[`../pages/${name}.tsx`]
  },
})
```

#### Svelte Example

```ts
// src/client/app.ts
import { initInertia } from '@inertiajs/astro/client/svelte'

initInertia({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
    return pages[`../pages/${name}.svelte`]
  },
})
```

## Smart Component Resolver

The smart component resolver supports `.client` and `.server` naming conventions for better developer experience. The resolvers are exported from both the main package and from the framework-specific client modules.

- `Component.client.vue` → client-side rendered
- `Component.server.vue` → server-side rendered
- `Component.vue` → defaults to server-side rendering

### Using createResolver

You can import the resolver from the main package or from the client module:

```ts
// src/client/app.ts
// Option 1: Import from main package
import { createResolver } from '@inertiajs/astro'
import { initInertia } from '@inertiajs/astro/client/vue'

// Option 2: Import from client module (both available)
import { initInertia, createResolver } from '@inertiajs/astro/client/vue'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.vue', { eager: true }),
  extensions: ['.vue'],
  defaultMode: 'server', // Components without .client or .server suffix default to server
})

initInertia({ resolve })
```

### Using createSimpleResolver

For simpler use cases:

```ts
// src/client/app.ts
// Can import from main package or client module
import { initInertia, createSimpleResolver } from '@inertiajs/astro/client/vue'

const resolve = createSimpleResolver({
  pages: import.meta.glob('../pages/**/*.vue', { eager: true }),
  extension: '.vue',
})

initInertia({ resolve })
```

## Page Structure Examples

### Traditional Approach

Before, you might have organized pages in separate folders:

```
src/
  pages/
    astro/
      dashboard.astro
      profile.astro
    inertia/
      Dashboard.vue
      Profile.vue
```

### New Naming Convention

Now you can use a flat structure with naming conventions:

```
src/
  pages/
    Dashboard.client.vue     # Client-side rendered
    Profile.server.vue       # Server-side rendered
    Settings.vue             # Defaults to server-side
```

## Multiple Frameworks

The resolver works with all supported frameworks:

### Vue

```ts
import { createResolver } from '@inertiajs/astro/client/vue'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.vue', { eager: true }),
  extensions: ['.vue'],
})
```

### React

```ts
import { createResolver } from '@inertiajs/astro/client/react'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.{tsx,jsx}', { eager: true }),
  extensions: ['.tsx', '.jsx'],
})
```

### Svelte

```ts
import { createResolver } from '@inertiajs/astro/client/svelte'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.svelte', { eager: true }),
  extensions: ['.svelte'],
})
```

## API Reference

### createResolver(options)

Creates a smart component resolver that supports `.client` and `.server` naming conventions.

#### Options

- `pages` (required): Record<string, any> - Glob import of page components
- `extensions` (optional): string[] - File extensions to support (default: `['.vue']`)
- `defaultMode` (optional): 'client' | 'server' - Default rendering mode (default: `'server'`)

#### Returns

ComponentResolver function

### createSimpleResolver(options)

Creates a simplified component resolver.

#### Options

- `pages` (required): Record<string, any> - Glob import of page components
- `extension` (required): string - Single file extension to support

#### Returns

ComponentResolver function

## Component Resolution Priority

The resolver tries to find components in the following order:

1. `./pages/{name}.client.{ext}` - Client-side version
2. `./pages/{name}.server.{ext}` - Server-side version
3. `./pages/{name}.{ext}` - Default version (uses `defaultMode`)
4. `./Pages/{name}.client.{ext}` - Capital Pages directory variants
5. `./Pages/{name}.server.{ext}`
6. `./Pages/{name}.{ext}`

## License

MIT
