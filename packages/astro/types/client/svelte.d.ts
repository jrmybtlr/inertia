import { type PageProps } from '@inertiajs/core';
import type { InitInertiaOptions } from '../types';
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
export declare function initInertia<SharedProps extends PageProps = PageProps>(options: InitInertiaOptions<SharedProps>): Promise<void>;
export { router } from '@inertiajs/core';
