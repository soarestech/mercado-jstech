// 🔹 Nome do cache e versão manual
const CACHE_VERSION = "1.0.2"; // atualize sempre que fizer deploy
const CACHE_NAME = `mercado-jstech-${CACHE_VERSION}`;

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/main.js",
  "./images/logo-512.png",
  "./images/search-48.png",
  "./images/report-48.png",
  "./images/settings-48.png",
  "./images/shopping-48.png",
  "./images/exit-48.png",
  "./images/icons/icon-192.png",
  "./images/icons/icon-512.png"
];

// INSTALAÇÃO
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // ⚡ Faz o SW assumir imediatamente
});

// ATIVAÇÃO
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Limpa caches antigos
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)));

      // Força SW a assumir os clientes ativos (tabs ou PWA)
      await self.clients.claim();

      // ⚡ Atualiza todos os clientes ativos
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      clients.forEach(client => client.navigate(client.url));
    })()
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
