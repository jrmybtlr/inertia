# Example Usage

This directory contains examples of how to use the smart component resolver with the new `.client` and `.server` naming conventions.

**Important:** The `.client` and `.server` naming conventions are **organizational only**. All Inertia components are client-side rendered (that's how Inertia.js works). These suffixes help you categorize and organize your components but don't affect the actual rendering behavior.

## File Structure

```
pages/
  Dashboard.client.vue       # Organizational: interactive/dynamic component
  Profile.server.vue         # Organizational: data-display component
  Settings.vue               # Standard naming
  Users.client.tsx           # React interactive component
  Posts.server.svelte        # Svelte data-display component
```

## Vue Example

```typescript
// src/app.ts
import { initInertia, createResolver } from '@inertiajs/astro/client/vue'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.vue', { eager: true }),
  extensions: ['.vue']
})

initInertia({ resolve })
```

When Laravel returns a component name like `Dashboard`, the resolver will:
1. First try `./pages/Dashboard.client.vue` ✓ (found - organizational marker)
2. Mount the component

When Laravel returns `Profile`, the resolver will:
1. First try `./pages/Profile.client.vue` ✗ (not found)
2. Then try `./pages/Profile.server.vue` ✓ (found - organizational marker)
3. Mount the component

When Laravel returns `Settings`, the resolver will:
1. First try `./pages/Settings.client.vue` ✗ (not found)
2. Then try `./pages/Settings.server.vue` ✗ (not found)
3. Finally try `./pages/Settings.vue` ✓ (found - standard naming)
4. Mount the component

## React Example

```typescript
// src/app.ts
import { initInertia, createResolver } from '@inertiajs/astro/client/react'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.{tsx,jsx}', { eager: true }),
  extensions: ['.tsx', '.jsx']
})

initInertia({ resolve })
```

## Svelte Example

```typescript
// src/app.ts
import { initInertia, createResolver } from '@inertiajs/astro/client/svelte'

const resolve = createResolver({
  pages: import.meta.glob('../pages/**/*.svelte', { eager: true }),
  extensions: ['.svelte']
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
    Dashboard.client.vue   # Organizational: interactive
    Profile.server.vue     # Organizational: data-display
    Settings.vue           # Standard naming
```

## Benefits

1. **Clear Organization**: File name helps categorize component purpose
2. **Flat Structure**: No need for nested folders
3. **Flexible**: Mix and match as needed
4. **Backward Compatible**: Existing code continues to work

## Note on Naming

Remember: All Inertia components are client-side rendered by design. The `.client` and `.server` suffixes are purely organizational conventions to help you categorize components (e.g., highly interactive vs. primarily data-display), not actual rendering modes.
