import { router, setupProgress, type Page, type PageProps } from '@inertiajs/core'
import type { ComponentResolver, InitInertiaOptions } from '../types'

/**
 * Initialize Inertia with Svelte in an Astro island
 *
 * This function fetches the initial page data from your Laravel backend
 * and mounts the Svelte Inertia application.
 *
 * @example
 * ```ts
 * import { initInertia } from '@inertiajs/astro/client/svelte'
 *
 * initInertia({
 *   resolve: (name) => {
 *     const pages = import.meta.glob('./pages/*.svelte', { eager: true })
 *     return pages[`./pages/${name}.svelte`]
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

  // Dynamically import Svelte Inertia adapter
  const inertiaSvelte = await import('@inertiajs/svelte')
  const { default: App } = inertiaSvelte

  // Resolve the initial component
  const resolveComponent = createComponentResolver(options.resolve)
  const initialComponent = await resolveComponent(initialPage.component)

  // Clear loading state
  islandEl.innerHTML = ''
  islandEl.setAttribute('data-inertia-mounted', 'true')

  // Setup progress bar
  if (progress !== false) {
    setupProgress(progress || {})
  }

  // Create the Svelte app
  // Svelte 5 uses mount(), Svelte 4 uses new App()
  const props = {
    initialPage,
    initialComponent,
    resolveComponent,
  }

  // Try Svelte 5 mount first, fall back to Svelte 4
  try {
    const { mount } = await import('svelte')
    mount(App, {
      target: islandEl,
      props,
    })
  } catch {
    // Svelte 4 fallback
    new App({
      target: islandEl,
      props,
    })
  }

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
export { createResolver, createSimpleResolver } from '../resolvers'
