const CACHE_NAME = 'k2tap-garcom-v1'
const APP_SHELL = '/garcom'
const ALERT_VIBRATION = [350, 120, 350, 120, 700]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

// Rede primeiro, cache como rede de segurança. Só o painel da equipe é tratado
// aqui: o restante do site nunca deve ser servido de um cache offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (!url.pathname.startsWith(APP_SHELL)) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(APP_SHELL))),
  )
})

self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data?.json() || {}
  } catch {
    payload = { body: event.data?.text() || 'Nova chamada de mesa.' }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || '🔔 K2 Tap · chamado de mesa', {
      body: payload.body || 'Nova solicitação de atendimento.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: payload.tag || `k2tap-push-${Date.now()}`,
      renotify: true,
      requireInteraction: true,
      silent: false,
      vibrate: ALERT_VIBRATION,
      data: { url: payload.url || APP_SHELL },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || APP_SHELL

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.includes(APP_SHELL))
      if (existing) {
        existing.focus()
        return existing.navigate(targetUrl)
      }
      return self.clients.openWindow(targetUrl)
    }),
  )
})
