/* Férias Certa — service worker
   Rede primeiro, cache como reserva.
   Só guarda resposta OK (nunca 404). Trocar CACHE força update em todos os aparelhos. */
const CACHE = 'ferias-certa-2026.08s'
const CASCO = [
  './',
  './index.html',
  './manifest.json',
  './feriados.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './icon-maskable-512.png',
]

const cachearOk = async (req, res) => {
  if (!res || !res.ok || res.type === 'opaque') return
  try {
    const copia = res.clone()
    const c = await caches.open(CACHE)
    await c.put(req, copia)
  } catch (_) { /* quota / opaque: ignora */ }
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(
        CASCO.map(u =>
          fetch(u)
            .then(r => (r.ok ? c.put(u, r) : null))
            .catch(() => null)
        )
      ))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then(r => {
        cachearOk(e.request, r)
        return r
      })
      .catch(() =>
        caches.match(e.request).then(r => r || caches.match('./index.html'))
      )
  )
})
