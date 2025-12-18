import { type PageProps } from '@inertiajs/core';
import type { InitInertiaOptions } from '../types';
/**
 * Initialize Inertia with Vue 3 in an Astro island
 *
 * This function fetches the initial page data from your Laravel backend
 * and mounts the Vue Inertia application.
 *
 * @example
 * ```ts
 * import { initInertia } from '@inertiajs/astro/client/vue'
 *
 * initInertia({
 *   resolve: (name) => {
 *     const pages = import.meta.glob('./pages/*.vue', { eager: true })
 *     return pages[`./pages/${name}.vue`]
 *   },
 * })
 * ```
 */
export declare function initInertia<SharedProps extends PageProps = PageProps>(options: InitInertiaOptions<SharedProps>): Promise<void>;
export { router } from '@inertiajs/core';
