import type { AstroIntegration } from 'astro'
import type { InertiaAstroConfig, InertiaAstroOptions } from './types'

export type { InertiaAstroOptions, InertiaIslandProps, InitInertiaOptions, ComponentResolver } from './types'

/**
 * Astro integration for Inertia.js
 *
 * This integration allows you to use Inertia as an island within Astro,
 * where Astro owns the page shell and Inertia handles the interactive app region.
 *
 * @example
 * ```js
 * // astro.config.mjs
 * import inertia from '@inertiajs/astro'
 *
 * export default {
 *   integrations: [
 *     inertia({
 *       framework: 'react',
 *       laravelUrl: 'http://localhost:8000',
 *     }),
 *   ],
 * }
 * ```
 */
export default function inertiaAstro(options: InertiaAstroOptions): AstroIntegration {
  const config: InertiaAstroConfig = {
    framework: options.framework,
    laravelUrl: options.laravelUrl || '',
    includeCredentials: options.includeCredentials ?? true,
    progress: options.progress,
  }

  return {
    name: '@inertiajs/astro',
    hooks: {
      'astro:config:setup': ({ injectScript, updateConfig }) => {
        // Inject the configuration as a global variable
        injectScript(
          'page',
          `window.__INERTIA_ASTRO_CONFIG__ = ${JSON.stringify(config)};`,
        )

        // Configure Vite to dedupe framework packages
        // This ensures that dynamic imports (from the Astro client) and static imports
        // (from user's page components) resolve to the same module instance.
        // Without this, module-level state like headManager won't be shared properly.
        updateConfig({
          vite: {
            resolve: {
              dedupe: ['vue', '@inertiajs/vue3', '@inertiajs/react', '@inertiajs/svelte', '@inertiajs/core'],
            },
          },
        })
      },
    },
  }
}

/**
 * Get the Inertia configuration from the window object (client-side only)
 */
export function getInertiaConfig(): InertiaAstroConfig | undefined {
  if (typeof window !== 'undefined') {
    return window.__INERTIA_ASTRO_CONFIG__
  }
  return undefined
}
