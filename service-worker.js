// 🔹 Nome do cache e versão manual (aumente quando fizer deploy)
// Versão do cache
const CACHE_VERSION = "1.0.1";
const CACHE_NAME = `mercado-jstech-${CACHE_VERSION}`;

// ⚡ Expor versão para o main.js via postMessage
self.addEventListener("message", (event) => {
  if (event.data?.type === "GET_VERSION") {
    event.source.postMessage({ type: "VERSION", version: CACHE_VERSION });
  }
});

// Arquivos a serem cacheados (TUDO relativo!)
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
  self.skipWaiting();
});

// ATIVAÇÃO
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
