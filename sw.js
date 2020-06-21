var CACHE_STATIC_NAME = 'static-v7';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting(); //PENTING bila ada versi baru!!
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll([
 '/index.html',
 '/manifest.json',
 '/script/index.js',
 '/script/jquery-3.3.1.min.js',
 '/script/materialize.min.js',
 '/css/boostrap.min.css',
 '/css/materialize.min.css',
 '/images/icon/icon-48x48.png',
 '/images/icon/icon-96x96.png',
 '/images/icon/icon-144x144.png',
 '/images/icon/icon-192x192.png',
 '/images/icon/icon-256x256.png',
 '/images/icon/icon-384x384.png',
 '/images/icon/icon-512x512.png'
      ])
    })
  )
});


self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        let responseClone = response.clone();
        caches.open(CACHE_STATIC_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      });
    }).catch(() => {
      //console.log('ini belum ada inet');
      //window.alert("sometext");
      return caches.match('/offline.html');
    })
  );
});
