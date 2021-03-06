const STATIC_CACHE_NAME = 'cache-static-v7';
const DYNAMIC_CACHE_NAME = 'cache-dynamic-v2';
const STATIC_ASSETS = [ 
  './',
 './index.html',
 './offline.html',
 './about.html',
 './manifest.json',
 './corona.jpg',
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
];

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting(); //PENTING bila ada versi baru!!
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
    .then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll([
        './index.html',
        './offline.html',
        './css/bootstrap.min.css'

      ])
    })
  )
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)		//newly opened pages are cached dynamically
            .then(function(res) {
              return caches.open(DYNAMIC_CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            });
        }
      })
  );
});
self.addEventListener('activate', (evt) => {
 evt.waitUntil( 
     caches.keys().then((keyList) => { 
         return Promise.all(keyList.map((key) => { 
             if (key !== STATIC_CACHE_NAME) { 
                 console.log('[ServiceWorker] Removing old cache', key); 
                 return caches.delete(key); 
             } 
         }));
     })
 ); 
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

