const CACHE_NAME = 'qwerty-cache';

let urls = ['/', '/signin', '/signup', 'profile', '/score', '/singleplayer'];

addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request.url)
            .then(function (response) {
                // Cache hit - return response
                var url = new URL(event.request.url);
                console.log("trigger 1");
                if (!navigator.onLine) {
                    if (response) {
                        return response;
                    } else if (urls.includes(url.pathname)) {
                        console.log("trigger 2");
                        url.pathname = '/';
                        return caches.match(url).then(response => {
                            if (response) {
                                return response;
                            } else {
                                return null;
                            }
                        });
                    } else {
                        console.log("BAD with: ", url.pathname);
                    }
                }

                return fetch(event.request).then(function (response) {
                    console.log("trigger 3");
                    // Check if we received a not valid response
                    if (!response || response.status !== 200) {
                        console.log("trigger 4");
                        return response;
                    }
                    console.log("trigger 5");
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