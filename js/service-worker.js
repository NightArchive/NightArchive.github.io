
const CACHE_NAME = 'nightarchive-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/osint.html',
    '/deanon.html',
    '/tools.html',
    '/resources.html',
    '/docs.html',
    '/about.html',
    '/css/style.css',
    '/js/script.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.log('Cache installation error:', err))
    );
    self.skipWaiting();
});
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') {
        return;
    }
    event.respondWith(
        fetch(request)
            .then(response => {
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(request, responseClone);
                    });

                return response;
            })
            .catch(() => {
                return caches.match(request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

