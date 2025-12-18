<script lang="ts">
  import { router, setupProgress, type Page, type PageProps } from '@inertiajs/core'
  import { onMount } from 'svelte'
  import App from './App.svelte'
  import type { ResolvedComponent } from '../types'

  /**
   * The unique identifier for this island
   */
  export let id: string = 'app'

  /**
   * Component resolver function
   */
  export let resolve: (name: string) => ResolvedComponent | Promise<ResolvedComponent>

  /**
   * Initial page data (optional)
   * If not provided, will fetch from current URL with Inertia headers
   */
  export let initialPage: Page<PageProps> | undefined = undefined

  /**
   * URL to fetch initial data from (if initialPage not provided)
   * Defaults to window.location
   */
  export let url: string | undefined = undefined

  /**
   * Title callback function
   */
  export let title: ((title: string) => string) | undefined = undefined

  /**
   * Loading fallback text
   */
  export let fallback: string = 'Loading...'

  /**
   * Progress bar configuration
   */
  export let progress: false | object | undefined = undefined

  let className = ''
  $: className = $$props.class ? `inertia-island ${$$props.class}` : 'inertia-island'

  let isLoading = true
  let error: string | null = null
  let appComponent: typeof App | null = null
  let appProps: any = null

  const initializeIsland = async () => {
    try {
      // Get or fetch initial page data
      let pageData: Page<PageProps>

      if (initialPage) {
        pageData = initialPage
      } else {
        // Fetch initial page data
        const fetchUrl = url || window.location.href
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Inertia': 'true',
            'X-Inertia-Version': '',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
          throw new Error('Response is not JSON. Is the server returning an Inertia response?')
        }

        pageData = await response.json()
      }

      // Create component resolver
      const resolveComponent = async (name: string): Promise<ResolvedComponent> => {
        const module = await Promise.resolve(resolve(name))

        if (module === null || module === undefined) {
          throw new Error(`Component "${name}" not found`)
        }

        // Handle ESM default exports
        if (typeof module === 'object' && 'default' in module) {
          return (module as any).default
        }

        return module as ResolvedComponent
      }

      // Resolve initial component
      const initialComponent = await resolveComponent(pageData.component)

      // Initialize router for this island
      router.init({
        initialPage: pageData,
        resolveComponent,
        swapComponent: async () => {
          // Handled by App component
        },
      })

      // Setup progress bar
      if (progress !== false) {
        setupProgress((progress as object) || {})
      }

      // Prepare app props
      appComponent = App
      appProps = {
        initialPage: pageData,
        initialComponent,
        resolveComponent,
        titleCallback: title,
      }

      isLoading = false

      // Decrypt history if needed
      router.decryptHistory().catch(() => {})
    } catch (err) {
      console.error('[InertiaIsland] Initialization failed:', err)
      error = err instanceof Error ? err.message : 'Failed to initialize island'
      isLoading = false
    }
  }

  onMount(() => {
    initializeIsland()
  })
</script>

<div
  {id}
  class={className}
  data-inertia-island="true"
>
  {#if isLoading && !error}
    <div class="inertia-island-loading">{fallback}</div>
  {:else if error}
    <div class="inertia-island-error">{error}</div>
  {:else if appComponent && appProps}
    <svelte:component this={appComponent} {...appProps} />
  {/if}
</div>

<style>
  .inertia-island {
    min-height: 100px;
  }

  .inertia-island-loading,
  .inertia-island-error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: inherit;
    font-size: 0.875rem;
  }

  .inertia-island-loading {
    color: #6b7280;
  }

  .inertia-island-error {
    color: #dc2626;
  }
</style>
