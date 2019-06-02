
const CACHE_NAME = 'qwerty-cache';
const { assets } = global.serviceWorkerOption;

self.addEventListener('install', event => {
    event.waitUntil(() => {
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                ...assets,
                '/images/ship.png',
                '/images/meteor.png',
                '/images/arrow.svg',
                '/images/turn.jpg',
                '/fonts/16596.ttf'
            ]);
        });
    });
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (!navigator.onLine) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (/api/.test(event.request.url) || (response.status !== 200)) {
                            return response;
                        }
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    });
            })
    );
});
