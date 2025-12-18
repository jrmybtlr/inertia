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
   * @default ['.vue']
   * @example ['.vue'] for Vue, ['.tsx', '.jsx'] for React, ['.svelte'] for Svelte
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
 * import { createResolver } from '@inertiajs/astro'
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
    // Helper function to generate search paths for a given base directory
    const generatePaths = (baseDir: string): string[] => {
      const paths: string[] = []
      for (const ext of extensions) {
        // Try with .client suffix first
        paths.push(`${baseDir}/${name}.client${ext}`)
        // Then .server suffix
        paths.push(`${baseDir}/${name}.server${ext}`)
        // Finally, try without suffix (will use defaultMode)
        paths.push(`${baseDir}/${name}${ext}`)
      }
      return paths
    }

    // Try to find the component with various naming conventions
    // Priority order:
    // 1. ./pages directory (lowercase)
    // 2. ./Pages directory (capitalized)
    // 3. Root directory (./)
    const searchPaths: string[] = [...generatePaths('./pages'), ...generatePaths('./Pages'), ...generatePaths('.')]

    // Try to find the first matching component
    for (const path of searchPaths) {
      if (pages[path]) {
        return pages[path]
      }
    }

    // Component not found - provide helpful error message with all attempted paths
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
 * import { createSimpleResolver } from '@inertiajs/astro'
 *
 * const resolve = createSimpleResolver({
 *   pages: import.meta.glob('./pages/**\/*.vue', { eager: true }),
 *   extension: '.vue'
 * })
 * ```
 */
export function createSimpleResolver(options: { pages: Record<string, any>; extension: string }): ComponentResolver {
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
