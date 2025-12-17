import type { ComponentResolver } from './types'

/**
 * Options for creating a smart component resolver
 */
export interface CreateResolverOptions {
  /**
   * Glob pattern for importing components
   * @example import.meta.glob('./pages/**\/*.vue', { eager: true })
   */
  pages: Record<string, any>

  /**
   * File extensions to support
   * @default ['.vue'] for Vue, ['.tsx', '.jsx'] for React, ['.svelte'] for Svelte
   */
  extensions?: string[]

  /**
   * Default rendering mode for components without .client or .server suffix
   * @default 'server'
   */
  defaultMode?: 'client' | 'server'
}

/**
 * Creates a smart component resolver that supports .client and .server naming conventions
 *
 * This helper automatically resolves components based on their naming:
 * - `Component.client.vue` → client-side rendered
 * - `Component.server.vue` → server-side rendered
 * - `Component.vue` → uses defaultMode (defaults to server-side)
 *
 * @example
 * ```ts
 * import { createResolver } from '@inertiajs/astro/resolvers'
 *
 * const resolve = createResolver({
 *   pages: import.meta.glob('./pages/**\/*.vue', { eager: true }),
 *   extensions: ['.vue'],
 *   defaultMode: 'server'
 * })
 *
 * initInertia({ resolve })
 * ```
 */
export function createResolver(options: CreateResolverOptions): ComponentResolver {
  const { pages, extensions = ['.vue'], defaultMode = 'server' } = options

  return (name: string) => {
    // Try to find the component with various naming conventions
    // Priority order:
    // 1. Exact match with .client suffix
    // 2. Exact match with .server suffix
    // 3. Exact match without suffix (uses defaultMode)
    // 4. Try all extensions with each convention

    const searchPaths: string[] = []

    // For each extension, try the different conventions
    for (const ext of extensions) {
      // Try with .client suffix first
      searchPaths.push(`./pages/${name}.client${ext}`)

      // Then .server suffix
      searchPaths.push(`./pages/${name}.server${ext}`)

      // Finally, try without suffix (will use defaultMode)
      searchPaths.push(`./pages/${name}${ext}`)
    }

    // Try to find the first matching component
    for (const path of searchPaths) {
      if (pages[path]) {
        return pages[path]
      }
    }

    // If not found in ./pages, try other common patterns
    const alternativePaths: string[] = []
    for (const ext of extensions) {
      alternativePaths.push(`./Pages/${name}.client${ext}`)
      alternativePaths.push(`./Pages/${name}.server${ext}`)
      alternativePaths.push(`./Pages/${name}${ext}`)
      alternativePaths.push(`./${name}.client${ext}`)
      alternativePaths.push(`./${name}.server${ext}`)
      alternativePaths.push(`./${name}${ext}`)
    }

    for (const path of alternativePaths) {
      if (pages[path]) {
        return pages[path]
      }
    }

    // Component not found
    throw new Error(
      `Component "${name}" not found. Make sure to import it with the correct path. Tried: ${searchPaths.join(', ')}`,
    )
  }
}

/**
 * Creates a simple component resolver for a single directory with a specific extension
 *
 * This is a simplified version that works with a standard folder structure.
 *
 * @example
 * ```ts
 * import { createSimpleResolver } from '@inertiajs/astro/resolvers'
 *
 * const resolve = createSimpleResolver({
 *   pages: import.meta.glob('./pages/**\/*.vue', { eager: true }),
 *   extension: '.vue'
 * })
 * ```
 */
export function createSimpleResolver(options: {
  pages: Record<string, any>
  extension: string
}): ComponentResolver {
  const { pages, extension } = options

  return (name: string) => {
    // Try with .client suffix first
    const clientPath = `./pages/${name}.client${extension}`
    if (pages[clientPath]) {
      return pages[clientPath]
    }

    // Try with .server suffix
    const serverPath = `./pages/${name}.server${extension}`
    if (pages[serverPath]) {
      return pages[serverPath]
    }

    // Try without suffix (defaults to server rendering)
    const defaultPath = `./pages/${name}${extension}`
    if (pages[defaultPath]) {
      return pages[defaultPath]
    }

    // Try capital Pages directory
    const capitalClientPath = `./Pages/${name}.client${extension}`
    if (pages[capitalClientPath]) {
      return pages[capitalClientPath]
    }

    const capitalServerPath = `./Pages/${name}.server${extension}`
    if (pages[capitalServerPath]) {
      return pages[capitalServerPath]
    }

    const capitalDefaultPath = `./Pages/${name}${extension}`
    if (pages[capitalDefaultPath]) {
      return pages[capitalDefaultPath]
    }

    throw new Error(`Component "${name}" not found`)
  }
}
