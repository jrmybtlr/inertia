import { router, setupProgress, type Page, type PageProps } from '@inertiajs/core'
import { createElement, FunctionComponent, useEffect, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import App from './App'
import { ReactComponent } from './types'

export interface InertiaIslandProps<SharedProps extends PageProps = PageProps> {
  /**
   * The unique identifier for this island
   * Used to scope router and history to this island
   */
  id?: string

  /**
   * Component resolver function
   */
  resolve: (name: string) => ReactComponent | Promise<ReactComponent>

  /**
   * Initial page data (optional)
   * If not provided, will fetch from current URL with Inertia headers
   */
  initialPage?: Page<SharedProps>

  /**
   * URL to fetch initial data from (if initialPage not provided)
   * Defaults to window.location
   */
  url?: string

  /**
   * Title callback function
   */
  title?: (title: string) => string

  /**
   * Loading fallback component
   */
  fallback?: React.ReactNode

  /**
   * CSS class for the container
   */
  className?: string

  /**
   * Progress bar configuration
   */
  progress?: false | object
}

/**
 * InertiaIsland component
 *
 * Renders an independent Inertia.js application within a specific DOM region.
 * Multiple islands can exist on the same page, each with their own router and state.
 *
 * @example
 * ```tsx
 * import { InertiaIsland } from '@inertiajs/react'
 *
 * function MyApp() {
 *   return (
 *     <div>
 *       <header>Static Header</header>
 *       <InertiaIsland
 *         resolve={(name) => import(`./Pages/${name}`)}
 *         url="/app/dashboard"
 *       />
 *       <footer>Static Footer</footer>
 *     </div>
 *   )
 * }
 * ```
 */
const InertiaIsland: FunctionComponent<InertiaIslandProps> = <SharedProps extends PageProps = PageProps>({
  id = 'app',
  resolve,
  initialPage: providedInitialPage,
  url,
  title,
  fallback = 'Loading...',
  className,
  progress: progressConfig,
}: InertiaIslandProps<SharedProps>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<Root | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const initializeIsland = async () => {
      if (!containerRef.current) return

      try {
        // Get or fetch initial page data
        let initialPage: Page<SharedProps>

        if (providedInitialPage) {
          initialPage = providedInitialPage
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

          initialPage = await response.json()
        }

        if (cancelled) return

        // Create component resolver
        const resolveComponent = async (name: string): Promise<ReactComponent> => {
          const module = await Promise.resolve(resolve(name))

          if (module === null || module === undefined) {
            throw new Error(`Component "${name}" not found`)
          }

          // Handle ESM default exports
          if (typeof module === 'object' && 'default' in module) {
            return (module as { default: ReactComponent }).default
          }

          return module as ReactComponent
        }

        // Resolve initial component
        const initialComponent = await resolveComponent(initialPage.component)

        if (cancelled) return

        // Initialize router for this island
        router.init({
          initialPage,
          resolveComponent,
          swapComponent: async () => {
            // Handled by App component
          },
        })

        // Setup progress bar
        if (progressConfig !== false) {
          setupProgress(progressConfig || {})
        }

        // Create and render the React app
        const props = {
          initialPage,
          initialComponent,
          resolveComponent,
          titleCallback: title,
        }

        if (!rootRef.current) {
          rootRef.current = createRoot(containerRef.current)
        }

        rootRef.current.render(createElement(App, props))

        setIsLoading(false)

        // Decrypt history if needed
        router.decryptHistory().catch(() => {})
      } catch (err) {
        if (!cancelled) {
          console.error('[InertiaIsland] Initialization failed:', err)
          setError(err instanceof Error ? err.message : 'Failed to initialize island')
          setIsLoading(false)
        }
      }
    }

    initializeIsland()

    return () => {
      cancelled = true
      // Cleanup: unmount the React app
      if (rootRef.current) {
        rootRef.current.unmount()
        rootRef.current = null
      }
    }
  }, [])

  return createElement(
    'div',
    {
      ref: containerRef,
      id,
      className: className ? `inertia-island ${className}` : 'inertia-island',
      'data-inertia-island': true,
    },
    isLoading && !error ? fallback : error ? createElement('div', { className: 'inertia-island-error' }, error) : null,
  )
}

InertiaIsland.displayName = 'InertiaIsland'

export default InertiaIsland
