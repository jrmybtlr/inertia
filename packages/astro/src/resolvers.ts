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
}

/**
 * Creates a smart component resolver that supports .client and .server naming conventions
 *
 * This helper automatically resolves components based on their file naming convention.
 * The .client and .server suffixes are organizational conventions that help you
 * categorize components, but don't affect rendering behavior (all Inertia components
 * are client-side rendered by design).
 *
 * Resolution priority:
 * - `Component.client.vue` (tried first)
 * - `Component.server.vue` (tried second)
 * - `Component.vue` (tried last)
 *
 * @example
 * ```ts
 * import { createResolver } from '@inertiajs/astro'
 *
 * const resolve = createResolver({
 *   pages: import.meta.glob('./pages/**\/*.vue', { eager: true }),
 *   extensions: ['.vue']
 * })
 *
 * initInertia({ resolve })
 * ```
 */
export function createResolver(options: CreateResolverOptions): ComponentResolver {
  const { pages, extensions = ['.vue'] } = options

  return (name: string) => {
    // Resolution priority order:
    // 1. .client suffix (organizational convention)
    // 2. .server suffix (organizational convention)
    // 3. No suffix (default/standard naming)
    //
    // Directory priority (for each naming variant):
    // 1. ./pages directory (lowercase)
    // 2. ./Pages directory (capitalized)
    // 3. Root directory (./)
    const modes: Array<'client' | 'server' | 'default'> = ['client', 'server', 'default']
    const baseDirs = ['./pages', './Pages', '.']
    const attemptedPaths: string[] = []

    // Try to find the first matching component following the documented priority
    for (const mode of modes) {
      for (const baseDir of baseDirs) {
        for (const ext of extensions) {
          const path =
            mode === 'default'
              ? `${baseDir}/${name}${ext}`
              : `${baseDir}/${name}.${mode}${ext}`

          attemptedPaths.push(path)

          if (pages[path]) {
            return pages[path]
          }
        }
      }
    }

    // Component not found - provide helpful error message with all attempted paths
    throw new Error(
      `Component "${name}" not found. Make sure to import it with the correct path. Tried: ${attemptedPaths.join(', ')}`,
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
    // Try with .client suffix first (organizational convention)
    const clientPath = `./pages/${name}.client${extension}`
    if (pages[clientPath]) {
      return pages[clientPath]
    }

    // Try with .server suffix (organizational convention)
    const serverPath = `./pages/${name}.server${extension}`
    if (pages[serverPath]) {
      return pages[serverPath]
    }

    // Try without suffix (standard naming)
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
