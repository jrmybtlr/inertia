import { router, setupProgress, type Page, type PageProps } from '@inertiajs/core'
import type { ComponentResolver, InitInertiaOptions } from '../types'

/**
 * Initialize Inertia with React in an Astro island
 *
 * This function fetches the initial page data from your Laravel backend
 * and mounts the React Inertia application.
 *
 * @example
 * ```ts
 * import { initInertia } from '@inertiajs/astro/client/react'
 *
 * initInertia({
 *   resolve: (name) => {
 *     const pages = import.meta.glob('./pages/*.tsx', { eager: true })
 *     return pages[`./pages/${name}.tsx`]
 *   },
 * })
 * ```
 */
export async function initInertia<SharedProps extends PageProps = PageProps>(
  options: InitInertiaOptions<SharedProps>,
): Promise<void> {
  const config = window.__INERTIA_ASTRO_CONFIG__
  const id = options.id || 'app'
  const islandEl = document.getElementById(id)

  if (!islandEl) {
    console.warn(`[Inertia] Mount element #${id} not found`)
    return
  }

  // Get configuration from integration or options
  const laravelUrl = options.laravelUrl || config?.laravelUrl || ''
  const includeCredentials = options.includeCredentials ?? config?.includeCredentials ?? true
  const progress = options.progress ?? config?.progress

  // Fetch initial page data from Laravel if not provided
  let initialPage = options.initialPage
  if (!initialPage) {
    initialPage = await fetchInitialPage<SharedProps>(laravelUrl, includeCredentials)
  }

  if (!initialPage) {
    console.error('[Inertia] Failed to fetch initial page data')
    return
  }

  // Dynamically import React and ReactDOM
  const [React, ReactDOM, inertiaReact] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('@inertiajs/react'),
  ])

  const { App } = inertiaReact
  const { createElement } = React
  const { createRoot } = ReactDOM

  // Resolve the initial component
  const resolveComponent = createComponentResolver(options.resolve)
  const initialComponent = await resolveComponent(initialPage.component)

  // Clear loading state
  islandEl.innerHTML = ''
  islandEl.setAttribute('data-inertia-mounted', 'true')

  // Initialize the router
  router.init({
    initialPage,
    resolveComponent,
    swapComponent: async ({ component, page, preserveState }) => {
      // This will be replaced by the App component's internal state management
    },
  })

  // Setup progress bar
  if (progress !== false) {
    setupProgress(progress || {})
  }

  // Create the React app
  const props = {
    initialPage,
    initialComponent,
    resolveComponent,
    titleCallback: options.title,
  }

  const root = createRoot(islandEl)
  root.render(createElement(App, props))

  // Decrypt history if needed
  router.decryptHistory().catch(() => {})
}

/**
 * Fetch the initial page data from Laravel
 */
async function fetchInitialPage<SharedProps extends PageProps>(
  laravelUrl: string,
  includeCredentials: boolean,
): Promise<Page<SharedProps> | null> {
  try {
    const url = laravelUrl
      ? `${laravelUrl}${window.location.pathname}${window.location.search}`
      : `${window.location.pathname}${window.location.search}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Inertia': 'true',
        'X-Inertia-Version': '',
      },
      credentials: includeCredentials ? 'include' : 'same-origin',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('Response is not JSON. Is Laravel returning an Inertia response?')
    }

    return await response.json()
  } catch (error) {
    console.error('[Inertia] Failed to fetch initial page:', error)
    return null
  }
}

/**
 * Create a component resolver that handles various module formats
 */
function createComponentResolver(resolve: ComponentResolver) {
  return async (name: string): Promise<any> => {
    const module = await Promise.resolve(resolve(name))

    if (module === null || module === undefined) {
      throw new Error(`Component "${name}" not found`)
    }

    // Handle ESM default exports
    if (typeof module === 'object' && 'default' in module) {
      return (module as { default: unknown }).default
    }

    return module
  }
}

export { router } from '@inertiajs/core'
