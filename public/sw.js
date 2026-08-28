const CACHE_NAME = 'k2tap-garcom-demo-v2'
const APP_SHELL = ['/garcom']
const ALERT_VIBRATION = [350, 120, 350, 120, 700]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/garcom'))),
  )
})

self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data?.json() || {}
  } catch {
    payload = { body: event.data?.text() || 'Nova chamada de mesa no K2TAP.' }
  }

  const title = payload.title || '🔔 K2TAP Garçom'
  const body = payload.body || 'Nova solicitação de atendimento.'
  const tag = payload.tag || `k2tap-push-${Date.now()}`
  const url = payload.url || '/garcom'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag,
      renotify: true,
      requireInteraction: true,
      silent: false,
      vibrate: ALERT_VIBRATION,
      data: { url },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/garcom'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.includes('/garcom'))
      if (existing) {
        existing.focus()
        return existing.navigate(targetUrl)
      }
      return self.clients.openWindow(targetUrl)
    }),
  )
})
