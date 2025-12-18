/**
 * Example: Using InertiaIsland with React
 * 
 * This example shows how to create a hybrid application where the header
 * and footer are static React components, and the main content area is
 * an Inertia island that loads from your Laravel backend.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { InertiaIsland } from '@inertiajs/react'

// Static header component
function Header() {
  return (
    <header style={{ background: '#333', color: 'white', padding: '1rem' }}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
        <h1>My App</h1>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
          <li><a href="/" style={{ color: 'white' }}>Home</a></li>
          <li><a href="/about" style={{ color: 'white' }}>About</a></li>
          <li><a href="/app" style={{ color: 'white' }}>Dashboard</a></li>
        </ul>
      </nav>
    </header>
  )
}

// Static footer component
function Footer() {
  return (
    <footer style={{ background: '#f5f5f5', padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
      <p>&copy; 2025 My Company. All rights reserved.</p>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Static footer - always loads instantly
      </p>
    </footer>
  )
}

// Main app component
function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Static header - loads immediately */}
      <Header />

      {/* Dynamic Inertia island - fetches from backend */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '2rem auto', width: '100%', padding: '0 1rem' }}>
        <InertiaIsland
          // Resolve page components from your Pages directory
          resolve={(name) => {
            const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
            return pages[`./Pages/${name}.tsx`]
          }}
          
          // Optional: specify which route to load
          // If not provided, uses current browser URL
          url="/app/dashboard"
          
          // Optional: customize loading state
          fallback={
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '400px',
              fontSize: '1.5rem',
              color: '#666'
            }}>
              <div>
                <div className="spinner" />
                Loading your dashboard...
              </div>
            </div>
          }
          
          // Optional: customize page titles
          title={(title) => `${title} - My App`}
          
          // Optional: configure progress bar
          progress={{
            delay: 250,
            color: '#29d',
            includeCSS: true,
            showSpinner: false,
          }}
        />
      </main>

      {/* Static footer - loads immediately */}
      <Footer />
    </div>
  )
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)

/**
 * Example Page Component (./Pages/Dashboard.tsx)
 * 
 * This is what your Inertia page component would look like:
 * 
 * ```tsx
 * import { Head, Link } from '@inertiajs/react'
 * 
 * interface DashboardProps {
 *   user: {
 *     name: string
 *     email: string
 *   }
 *   stats: {
 *     visits: number
 *     revenue: number
 *   }
 * }
 * 
 * export default function Dashboard({ user, stats }: DashboardProps) {
 *   return (
 *     <>
 *       <Head title="Dashboard" />
 *       
 *       <div>
 *         <h1>Welcome back, {user.name}!</h1>
 *         
 *         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
 *           <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
 *             <h2>Visits</h2>
 *             <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.visits}</p>
 *           </div>
 *           <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
 *             <h2>Revenue</h2>
 *             <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${stats.revenue}</p>
 *           </div>
 *         </div>
 *         
 *         <div style={{ marginTop: '2rem' }}>
 *           <Link href="/app/settings">Go to Settings</Link>
 *         </div>
 *       </div>
 *     </>
 *   )
 * }
 * ```
 */

/**
 * Laravel Backend Example (routes/web.php)
 * 
 * Your Laravel routes work exactly the same as with standard Inertia:
 * 
 * ```php
 * use Inertia\Inertia;
 * 
 * Route::middleware(['web', 'auth'])->prefix('app')->group(function () {
 *     Route::get('/dashboard', function () {
 *         return Inertia::render('Dashboard', [
 *             'user' => auth()->user(),
 *             'stats' => [
 *                 'visits' => 1234,
 *                 'revenue' => 5678,
 *             ],
 *         ]);
 *     });
 *     
 *     Route::get('/settings', function () {
 *         return Inertia::render('Settings', [
 *             'user' => auth()->user(),
 *         ]);
 *     });
 * });
 * ```
 */

/**
 * HTML Entry Point (index.html)
 * 
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 *   <head>
 *     <meta charset="UTF-8" />
 *     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 *     <title>My App</title>
 *   </head>
 *   <body>
 *     <div id="root"></div>
 *     <script type="module" src="/src/main.tsx"></script>
 *   </body>
 * </html>
 * ```
 */
