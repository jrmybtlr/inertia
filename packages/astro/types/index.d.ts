import type { AstroIntegration } from 'astro';
import type { InertiaAstroConfig, InertiaAstroOptions } from './types';
export { createResolver, createSimpleResolver, type CreateResolverOptions } from './resolvers';
export type { ComponentResolver, InertiaAstroOptions, InertiaIslandProps, InitInertiaOptions } from './types';
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
export default function inertiaAstro(options: InertiaAstroOptions): AstroIntegration;
/**
 * Get the Inertia configuration from the window object (client-side only)
 */
export declare function getInertiaConfig(): InertiaAstroConfig | undefined;
