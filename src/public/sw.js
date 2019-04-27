const CACHE_NAME = 'qwerty-cache';

addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request.url)
            .then(function (response) {
            // Cache hit - return response
                if (!navigator.onLine) {
                    if (response) {
                        return response;
                    } else {
                        var url = new URL(event.request.url);
                        url.pathname = '/';
                        return caches.match(url).then(response => {
                            if (response) {
                                return response;
                            } else {
                                return null;
                            }
                        });
                    }
                }

                return fetch(event.request).then(function (response) {
                    // Check if we received a not valid response
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    let responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request.url, responseToCache);
                        });

                    return response;
                }
                );
            })
    );
});

this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (resp) {
            return resp || fetch(event.request).then(function (response) {
                caches.open('v1').then(function (cache) {
                    cache.put(event.request, response.clone());
                });
                return response;
            });
        }).catch(function () {
            return caches.match('/sw-test/gallery/myLittleVader.jpg');
        })
    );
});
