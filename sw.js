self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('first-app')
      .then(function(cache) {
        cache.addAll([
 './',
 './index.html',
 './manifest.json',
 './script/index.js',
 './script/jquery-3.3.1.min.js',
 './script/materialize.min.js',
 './css/boostrap.min.css',
 './css/materialize.min.css',
 './images/icon/icon-48x48.png',
 './images/icon/icon-96x96.png',
 './images/icon/icon-144x144.png',
 './images/icon/icon-192x192.png',
 './images/icon/icon-256x256.png',
 './images/icon/icon-384x384.png',
 './images/icon/icon-512x512.png'
        ])
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        return res;
      })
  );
});
