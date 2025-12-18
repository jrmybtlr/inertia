# Inertia.js React Adapter

Visit [inertiajs.com](https://inertiajs.com/) to learn more.

## New: InertiaIsland Component

The `InertiaIsland` component allows you to embed Inertia.js applications as independent islands within a larger React application:

```tsx
import { InertiaIsland } from '@inertiajs/react'

function App() {
  return (
    <div>
      <header>
        <h1>Static Header</h1>
      </header>
      <main>
        <InertiaIsland
          resolve={(name) => import(`./Pages/${name}.tsx`)}
          url="/app/dashboard"
          fallback={<div>Loading...</div>}
        />
      </main>
      <footer>
        <p>Static Footer</p>
      </footer>
    </div>
  )
}
```

Perfect for:
- Hybrid marketing + app pages
- Gradual migrations to Inertia
- Multi-region applications

See the [main repository documentation](https://github.com/inertiajs/inertia/blob/master/INERTIA_ISLANDS.md) for complete details.
