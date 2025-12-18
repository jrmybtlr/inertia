import type { Page, PageProps } from '@inertiajs/core'

export type InertiaFramework = 'react' | 'vue' | 'svelte'

export interface InertiaAstroOptions {
  /**
   * The frontend framework to use for rendering Inertia components
   */
  framework: InertiaFramework

  /**
   * The base URL of the Laravel backend
   * @example 'http://localhost:8000' or '/api'
   */
  laravelUrl?: string

  /**
   * Whether to include credentials (cookies) in requests to Laravel
   * @default true
   */
  includeCredentials?: boolean

  /**
   * Progress bar configuration
   * Set to false to disable the progress bar
   */
  progress?:
    | false
    | {
        delay?: number
        color?: string
        includeCSS?: boolean
        showSpinner?: boolean
      }
}

export interface InertiaIslandProps {
  /**
   * The ID of the mount element
   * @default 'app'
   */
  id?: string

  /**
   * CSS class to apply to the mount element
   */
  class?: string

  /**
   * Content to show while Inertia is loading
   * @default 'Loading...'
   */
  fallback?: string
}

export interface InitInertiaOptions<SharedProps extends PageProps = PageProps> {
  /**
   * The ID of the element to mount Inertia into
   * @default 'app'
   */
  id?: string

  /**
   * The base URL of the Laravel backend
   * If not provided, requests go to the same origin
   */
  laravelUrl?: string

  /**
   * Whether to include credentials (cookies) in requests
   * @default true
   */
  includeCredentials?: boolean

  /**
   * Function to resolve page components by name
   */
  resolve: ComponentResolver

  /**
   * Progress bar configuration
   */
  progress?:
    | false
    | {
        delay?: number
        color?: string
        includeCSS?: boolean
        showSpinner?: boolean
      }

  /**
   * Callback to transform the title
   */
  title?: (title: string) => string

  /**
   * Initial page data (if already available, skip fetching)
   */
  initialPage?: Page<SharedProps>
}

export type ComponentResolver = (name: string) => Promise<unknown> | unknown

export interface InertiaAstroConfig {
  framework: InertiaFramework
  laravelUrl: string
  includeCredentials: boolean
  progress: InertiaAstroOptions['progress']
}

declare global {
  interface Window {
    __INERTIA_ASTRO_CONFIG__?: InertiaAstroConfig
  }
}
