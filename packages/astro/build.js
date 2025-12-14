#!/usr/bin/env node
import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { readFileSync } from 'fs'

const watch = process.argv.slice(1).includes('--watch')
const withDeps = process.argv.slice(1).includes('--with-deps')

// For regular builds, externalize all dependencies to keep the bundle size small (using nodeExternalsPlugin).
// For builds with dependencies, only externalize peer dependencies and bundle everything
// else so we can check ES2020 compatibility without checking framework code.
let externalDependencies = undefined

if (withDeps) {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
  externalDependencies = Object.keys(pkg.peerDependencies || {})
}

const config = {
  bundle: true,
  minify: false,
  sourcemap: withDeps ? false : true,
  target: 'es2020',
  external: externalDependencies,
  plugins: [
    ...(withDeps ? [] : [nodeExternalsPlugin()]),
    {
      name: 'inertia',
      setup(build) {
        let count = 0
        build.onEnd((result) => {
          if (count++ !== 0) {
            console.log(`Rebuilding ${build.initialOptions.entryPoints} (${build.initialOptions.format})…`)
          }
        })
      },
    },
  ],
}

const builds = [
  // Main integration
  { entryPoints: ['src/index.ts'], format: 'esm', outfile: 'dist/index.esm.js', platform: 'node' },
  { entryPoints: ['src/index.ts'], format: 'cjs', outfile: 'dist/index.js', platform: 'node' },
  // React client
  { entryPoints: ['src/client/react.ts'], format: 'esm', outfile: 'dist/client/react.esm.js', platform: 'browser' },
  { entryPoints: ['src/client/react.ts'], format: 'cjs', outfile: 'dist/client/react.js', platform: 'browser' },
  // Vue client
  { entryPoints: ['src/client/vue.ts'], format: 'esm', outfile: 'dist/client/vue.esm.js', platform: 'browser' },
  { entryPoints: ['src/client/vue.ts'], format: 'cjs', outfile: 'dist/client/vue.js', platform: 'browser' },
  // Svelte client
  { entryPoints: ['src/client/svelte.ts'], format: 'esm', outfile: 'dist/client/svelte.esm.js', platform: 'browser' },
  { entryPoints: ['src/client/svelte.ts'], format: 'cjs', outfile: 'dist/client/svelte.js', platform: 'browser' },
]

builds.forEach(async (build) => {
  const context = await esbuild.context({ ...config, ...build })

  if (watch) {
    console.log(`Watching ${build.entryPoints} (${build.format})…`)
    await context.watch()
  } else {
    await context.rebuild()
    context.dispose()
    console.log(`Built ${build.entryPoints} (${build.format}) ${withDeps ? '(with-deps)' : ''}…`)
  }
})
