CACHE_NAME = 'qwerty-cache'

addEventListener('fetch', function(event) {

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
            // Cache hit - return response
            if (response) {
            return response;
            }

            return fetch(event.request).then(
            function(response) {
                // Check if we received a not valid response
                if(!response || response.status !== 200) {
                return response;
                }

                let responseToCache = response.clone();

                caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log('Fetching:', event.request.url);
                    cache.put(event.request, responseToCache);
                });

                return response;
            }
            );
        })
    );
});