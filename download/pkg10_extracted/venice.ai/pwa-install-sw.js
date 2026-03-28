self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
})

// Fetch event - required for PWA installability
self.addEventListener('fetch', event => {
  // Only intercept GET requests - let POST requests (e.g. Next.js RSC navigation) pass through natively
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)

  // Avoid proxying third-party traffic like Stripe's hosted checkout runtime.
  if (requestUrl.origin !== self.location.origin) {
    return
  }

  // Skip service worker for API calls to avoid stream issues
  if (requestUrl.pathname.startsWith('/api/')) {
    return
  }

  // Let checkout navigations bypass the service worker entirely.
  if (event.request.mode === 'navigate' && requestUrl.pathname.startsWith('/checkout')) {
    return
  }

  // Simply pass through all requests to the network
  event.respondWith(fetch(event.request))
})
