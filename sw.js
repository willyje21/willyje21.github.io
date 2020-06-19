const STATIC_ASSETS = [ 
 './',
 './index.html',
];

const STATIC_CACHE_NAME = 'cache-static';

self.addEventListener('install', async evt => {
  const cache = await caches.open(STATIC_CACHE_NAME);
  cache.addAll(STATIC_ASSETS);
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
