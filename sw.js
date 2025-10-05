self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("pharmacie-v1").then(cache => {
      return cache.addAll(["/","/pharmaciedesjumeaux.html","/index.html","/style.css","/script.js","/images/logo.png"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
