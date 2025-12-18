# Astro + Inertia Playground

This playground demonstrates the `@inertiajs/astro` integration, which allows you to build hybrid applications where Astro handles static content and Inertia powers the dynamic, authenticated portions of your app.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Astro Shell                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Header (static)                     │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              InertiaIsland                       │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │     Vue Component                       │    │   │
│  │  │     (fetched from Laravel)              │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Footer (static)                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Running the Playground

From the repository root:

```bash
pnpm playground:astro
```

This will:
1. Install PHP and Node.js dependencies
2. Set up the SQLite database
3. Start Laravel on http://localhost:8000
4. Start Astro on http://localhost:4321

Or run manually:

```bash
cd playgrounds/astro
./init.sh
composer run dev
```

## Explore the Demo

- **http://localhost:4321** - Static marketing home page (Astro)
- **http://localhost:4321/about** - Static about page (Astro)
- **http://localhost:4321/app** - Inertia-powered application (Vue)

## Pages

### Static Pages (Astro)

- `/` - Marketing home page with feature highlights
- `/about` - About page explaining the architecture

### Inertia Pages (Vue)

- `/app` - Application home/dashboard
- `/app/users` - User list (fetched from Laravel)
- `/app/article` - Article page with scroll anchors
- `/app/form` - Form demo using `useForm`
- `/app/defer` - Deferred props demo
- `/app/poll` - Polling demo using `usePoll`
- `/app/login` - Login page

## How It Works

1. **User visits `/app/users`**
2. **Astro** serves the static shell (header, nav, footer)
3. **Client-side JavaScript** initializes Inertia
4. **Inertia** fetches page data from Laravel via XHR
5. **The Vue component** hydrates inside the island
6. **Subsequent navigation** uses Inertia's SPA router

## Key Files

### Astro Frontend
- `astro.config.mjs` - Astro configuration with Inertia integration
- `src/layouts/AppLayout.astro` - Layout with InertiaIsland
- `src/pages/app/[...path].astro` - Catch-all route for Inertia pages
- `src/pages/app/inertia-pages/*.vue` - Vue page components

### Laravel Backend
- `routes/web.php` - Inertia routes (all prefixed with `/app`)
- `config/cors.php` - CORS configuration for Astro frontend
- `app/Http/Middleware/HandleInertiaRequests.php` - Inertia middleware


