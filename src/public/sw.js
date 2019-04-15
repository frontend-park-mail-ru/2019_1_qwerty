this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function (cache) {
            return cache.addAll([
                '/bundle.js',
                '/bundle.css',
                '/ship.png',
                '/meteor.jpg',
                '/meteor.png',
                '/default_ava.jpeg'
            ]);
        })
    );
});

// this.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//             .then((response) =>
//                 response || fetch(event.request).then(response => {
//                     return caches.open('v1').then(function (cache) {
//                         cache.put(event.request, response.clone());
//                         return response;
//                     });
//                 })
//             )
//     );
// });
