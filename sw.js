const STATIC_ASSETS = [ 
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
];

const STATIC_CACHE_NAME = 'cache-static-v5';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting(); //PENTING bila ada versi baru!!
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
    .then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll(STATIC_ASSETS)
    })
  )
});

self.addEventListener('fetch', evt => {
 const req = evt.request;
 const url = new URL(req.url);

 if (url.origin == location.origin) {
  evt.respondWith(cacheFirst(req));
 } else {
  evt.respondWith(networkFirst(req));
 }
});

async function cacheFirst(req) {
 const cachedResponse = await caches.match(req);
 return cachedResponse || fetch(req);
}

async function networkFirst(req) {
 const cache = await caches.open(STATIC_CACHE_NAME);
 try {
        // try go to network and fetch data 
  const res = await fetch(req);
  cache.put(req, res.clone());
  return res;
 } catch(error) {
        // look something on cache. 
  return await cache.match(req);
 }
}

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
