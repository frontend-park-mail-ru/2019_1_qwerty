
const CACHE_NAME = 'qwerty-cache';

let urls = ['/', '/signin/', '/signup/', '/profile/', '/score/', '/singleplayer/'];

self.addEventListener('install', event => {
    event.waitUntil(() => {
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([...global.serviceWorkerOption.assets,
                '/profile/'
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
// addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request.url)
//             .then(function (response) {
//                 // Cache hit - return response
//                 var url = new URL(event.request.url);
//                 if (!navigator.onLine) {
//                     if (response) {
//                         return response;
//                     } else if (urls.includes(url.pathname)) {
//                         url.pathname = '/';
//                         return caches.match(url).then(response => {
//                             if (response) {
//                                 return response;
//                             } else {
//                                 return null;
//                             }
//                         });
//                     }
//                 }
//
//                 return fetch(event.request).then(function (response) {
//                     // Check if we received a not valid response
//                     if (!response || response.status !== 200) {
//                         return response;
//                     }
//                     let responseToCache = response.clone();
//                     caches.open(CACHE_NAME)
//                         .then(function (cache) {
//                             cache.put(event.request.url, responseToCache);
//                         });
//
//                     return response;
//                 }
//                 );
//             })
//     );
// });
