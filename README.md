[![Inertia.js](https://raw.githubusercontent.com/inertiajs/inertia/master/.github/LOGO.png)](https://inertiajs.com/)

Inertia.js lets you quickly build modern single-page React, Vue and Svelte apps using classic server-side routing and controllers. Find full documentation at [inertiajs.com](https://inertiajs.com/).

## New: Inertia Islands (Native Approach)

Inertia now supports **native islands** - embed Inertia.js applications as independent regions within a larger page. Perfect for hybrid apps, gradual migrations, or multi-region applications.

```tsx
import { InertiaIsland } from '@inertiajs/react'

function App() {
  return (
    <>
      <header>Static Header</header>
      <InertiaIsland resolve={(name) => import(`./Pages/${name}.tsx`)} />
      <footer>Static Footer</footer>
    </>
  )
}
```

See [INERTIA_ISLANDS.md](INERTIA_ISLANDS.md) for complete documentation.

## Contributing

Thank you for considering contributing to Inertia! You can read the contribution guide [here](CONTRIBUTING.md).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

Please review [our security policy](https://github.com/inertiajs/inertia/security/policy) on how to report security vulnerabilities.

## License

Inertia is open-sourced software licensed under the [MIT license](LICENSE.md).
