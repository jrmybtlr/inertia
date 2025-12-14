import { type PageProps } from '@inertiajs/core';
import type { InitInertiaOptions } from '../types';
/**
 * Initialize Inertia with React in an Astro island
 *
 * This function fetches the initial page data from your Laravel backend
 * and mounts the React Inertia application.
 *
 * @example
 * ```ts
 * import { initInertia } from '@inertiajs/astro/client/react'
 *
 * initInertia({
 *   resolve: (name) => {
 *     const pages = import.meta.glob('./pages/*.tsx', { eager: true })
 *     return pages[`./pages/${name}.tsx`]
 *   },
 * })
 * ```
 */
export declare function initInertia<SharedProps extends PageProps = PageProps>(options: InitInertiaOptions<SharedProps>): Promise<void>;
export { router } from '@inertiajs/core';
