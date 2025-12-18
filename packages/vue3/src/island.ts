import { router, setupProgress, type Page, type PageProps } from '@inertiajs/core'
import {
  Component as VueComponent,
  computed,
  DefineComponent,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
} from 'vue'
import app from './app'

/**
 * InertiaIsland component for Vue 3
 *
 * Renders an independent Inertia.js application within a specific DOM region.
 * Multiple islands can exist on the same page, each with their own router and state.
 *
 * @example
 * ```vue
 * <template>
 *   <div>
 *     <header>Static Header</header>
 *     <InertiaIsland
 *       :resolve="resolve"
 *       url="/app/dashboard"
 *     />
 *     <footer>Static Footer</footer>
 *   </div>
 * </template>
 *
 * <script setup>
 * import { InertiaIsland } from '@inertiajs/vue3'
 *
 * const resolve = (name) => import(`./Pages/${name}.vue`)
 * </script>
 * ```
 */
export default defineComponent({
  name: 'InertiaIsland',

  props: {
    /**
     * The unique identifier for this island
     * Used to scope router and history to this island
     */
    id: {
      type: String,
      default: 'app',
    },

    /**
     * Component resolver function
     */
    resolve: {
      type: Function as PropType<(name: string) => DefineComponent | Promise<DefineComponent>>,
      required: true,
    },

    /**
     * Initial page data (optional)
     * If not provided, will fetch from current URL with Inertia headers
     */
    initialPage: {
      type: Object as PropType<Page>,
      default: undefined,
    },

    /**
     * URL to fetch initial data from (if initialPage not provided)
     * Defaults to window.location
     */
    url: {
      type: String,
      default: undefined,
    },

    /**
     * Title callback function
     */
    title: {
      type: Function as PropType<(title: string) => string>,
      default: undefined,
    },

    /**
     * Loading fallback text/component
     */
    fallback: {
      type: [String, Object] as PropType<string | VueComponent>,
      default: 'Loading...',
    },

    /**
     * Progress bar configuration
     */
    progress: {
      type: [Boolean, Object] as PropType<false | object>,
      default: undefined,
    },
  },

  setup(props, { attrs }) {
    const isLoading = ref(true)
    const error = ref<string | null>(null)
    const islandApp = ref<any>(null)
    const containerRef = ref<HTMLElement | null>(null)

    const initializeIsland = async () => {
      try {
        // Get or fetch initial page data
        let initialPage: Page<PageProps>

        if (props.initialPage) {
          initialPage = props.initialPage
        } else {
          // Fetch initial page data
          const fetchUrl = props.url || window.location.href
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

        // Create component resolver
        const resolveComponent = async (name: string): Promise<DefineComponent> => {
          const module = await Promise.resolve(props.resolve(name))

          if (module === null || module === undefined) {
            throw new Error(`Component "${name}" not found`)
          }

          // Handle ESM default exports
          if (typeof module === 'object' && 'default' in module) {
            return (module as { default: DefineComponent }).default
          }

          return module as DefineComponent
        }

        // Resolve initial component
        const initialComponent = await resolveComponent(initialPage.component)

        // Initialize router for this island
        router.init({
          initialPage,
          resolveComponent,
          swapComponent: async () => {
            // Handled by App component
          },
        })

        // Setup progress bar
        if (props.progress !== false) {
          setupProgress((props.progress as object) || {})
        }

        // Create the Vue app
        islandApp.value = h(app, {
          initialPage,
          initialComponent,
          resolveComponent,
          titleCallback: props.title,
        })

        isLoading.value = false

        // Decrypt history if needed
        router.decryptHistory().catch(() => {})
      } catch (err) {
        console.error('[InertiaIsland] Initialization failed:', err)
        error.value = err instanceof Error ? err.message : 'Failed to initialize island'
        isLoading.value = false
      }
    }

    onMounted(() => {
      initializeIsland()
    })

    onBeforeUnmount(() => {
      // Cleanup if needed
    })

    const className = computed(() => {
      const classes = ['inertia-island']
      if (attrs.class) {
        classes.push(attrs.class as string)
      }
      return classes.join(' ')
    })

    return () => {
      return h(
        'div',
        {
          ref: containerRef,
          id: props.id,
          class: className.value,
          'data-inertia-island': true,
        },
        isLoading.value && !error.value
          ? typeof props.fallback === 'string'
            ? h('div', { class: 'inertia-island-loading' }, props.fallback)
            : h(props.fallback)
          : error.value
            ? h('div', { class: 'inertia-island-error' }, error.value)
            : islandApp.value || null,
      )
    }
  },
})
