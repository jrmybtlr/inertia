# Example Usage

This directory contains examples of how to use the smart component resolver with the new `.client` and `.server` naming conventions.

## File Structure

```
pages/
  Dashboard.client.vue       # Client-side rendered
  Profile.server.vue         # Server-side rendered
  Settings.vue               # Defaults to server-side
  Users.client.tsx           # React client component
  Posts.server.svelte        # Svelte server component
```

## Vue Example

```typescript
// src/app.ts
import { initInertia, createResolver } from '@inertiajs/astro/client/vue'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.vue', { eager: true }),
  extensions: ['.vue'],
  defaultMode: 'server'
})

initInertia({ resolve })
```

When Laravel returns a component name like `Dashboard`, the resolver will:
1. First try `./pages/Dashboard.client.vue` ✓ (found)
2. Mount the client-side version

When Laravel returns `Profile`, the resolver will:
1. First try `./pages/Profile.client.vue` ✗ (not found)
2. Then try `./pages/Profile.server.vue` ✓ (found)
3. Mount the server-side version

When Laravel returns `Settings`, the resolver will:
1. First try `./pages/Settings.client.vue` ✗ (not found)
2. Then try `./pages/Settings.server.vue` ✗ (not found)
3. Finally try `./pages/Settings.vue` ✓ (found)
4. Mount using the default mode (server)

## React Example

```typescript
// src/app.ts
import { initInertia, createResolver } from '@inertiajs/astro/client/react'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.{tsx,jsx}', { eager: true }),
  extensions: ['.tsx', '.jsx'],
  defaultMode: 'server'
})

initInertia({ resolve })
```

## Svelte Example

```typescript
// src/app.ts
import { initInertia, createResolver } from '@inertiajs/astro/client/svelte'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.svelte', { eager: true }),
  extensions: ['.svelte'],
  defaultMode: 'server'
})

initInertia({ resolve })
```

## Migration from Old Structure

### Before (Separate Folders)

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

### After (Naming Conventions)

```
src/
  pages/
    Dashboard.client.vue
    Profile.server.vue
    Settings.vue  # defaults to server
```

## Benefits

1. **Clear Intent**: File name immediately tells you the rendering strategy
2. **Flat Structure**: No need for nested folders
3. **Flexible**: Mix and match as needed
4. **Backward Compatible**: Existing code continues to work
