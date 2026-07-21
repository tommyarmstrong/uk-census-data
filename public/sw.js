/* UK Census Data service worker — app shell only.
 * Chart/NOMIS payloads are not invented offline; the app uses last localStorage cache. */

const CACHE_NAME = "uk-census-shell-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Never cache NOMIS proxy responses here — app owns cache via localStorage.
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) {
          void cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
        if (request.mode === "navigate") {
          const home = await cache.match("/");
          if (home) {
            return home;
          }
        }
        return Response.error();
      }
    })(),
  );
});
