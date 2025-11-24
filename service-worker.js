// 🔹 Nome do cache e versão manual (aumente quando fizer deploy)
const CACHE_VERSION = '1.0.0'; // atualize sempre que subir nova versão
const CACHE_NAME = `mercado-jstech-cache-${CACHE_VERSION}`;

// 🔹 Arquivos essenciais a cachear
const URLS_TO_CACHE = [
  '/mercado-jstech/index.html',
  '/mercado-jstech/manifest.json',

  // 👇 Caminhos corrigidos
  '/mercado-jstech/images/icons/icon-192.png',
  '/mercado-jstech/images/icons/icon-512.png',

  '/mercado-jstech/css/styles.css',
  '/mercado-jstech/js/app.js'
];

// ---------------- Install: cache inicial ----------------
self.addEventListener('install', event => {
  console.log('🔹 [SW] Instalando e cacheando arquivos...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // ativa imediatamente
});

// ---------------- Activate: remove caches antigos e envia versão ----------------
self.addEventListener('activate', event => {
  console.log('🔹 [SW] Ativando e limpando caches antigos...');
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    );

    await self.clients.claim();

    const clientsList = await self.clients.matchAll();
    for (const client of clientsList) {
      client.postMessage({
        type: 'version',
        version: CACHE_VERSION
      });
    }
    console.log(`🔹 [SW] Versão ${CACHE_VERSION} enviada aos clientes.`);
  })());
});

// ---------------- Fetch: intercepta requisições ----------------
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // 👇 Caminho ajustado para sua pasta real
  if (!requestURL.pathname.startsWith('/mercado-jstech/')) return;

  // Network first para HTML
  if (requestURL.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        }))
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request).then(fetchResponse => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, fetchResponse.clone()));
          return fetchResponse;
        }))
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/mercado-jstech/index.html');
          }
        })
    );
  }
});

// ---------------- Força atualização automática ----------------
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'check-update') {
    self.skipWaiting();
  }
});