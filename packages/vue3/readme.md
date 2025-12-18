# Inertia.js Vue 3 Adapter

Visit [inertiajs.com](https://inertiajs.com/) to learn more.

## New: InertiaIsland Component

The `InertiaIsland` component allows you to embed Inertia.js applications as independent islands within a larger Vue application:

```vue
<template>
  <div>
    <header>
      <h1>Static Header</h1>
    </header>
    <main>
      <InertiaIsland
        :resolve="resolve"
        url="/app/dashboard"
        fallback="Loading..."
      />
    </main>
    <footer>
      <p>Static Footer</p>
    </footer>
  </div>
</template>

<script setup>
import { InertiaIsland } from '@inertiajs/vue3'

const resolve = (name) => import(`./Pages/${name}.vue`)
</script>
```

Perfect for:
- Hybrid marketing + app pages
- Gradual migrations to Inertia
- Multi-region applications

See the [main repository documentation](https://github.com/inertiajs/inertia/blob/master/INERTIA_ISLANDS.md) for complete details.
