
const cache_name = 'v2'
	
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name).then(function(cache) {
      return cache.addAll([
        'index.html',
        '/css/root.css',
        '/css/main.css',
        '/css/button.css',
        '/css/slider.css',
        '/css/select.css',
        '/css/header.css',
        '/css/alert.css',
        '/js/prototype.js',
        '/js/model.js',
        '/js/cookies.js',
        '/js/oscillator.js',
        '/js/note.js',
        '/js/alert.js',
        '/js/information.js',
        '/js/install.js',
        '/js/main.js'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
    console.log('fetch');
    event.respondWith(
        caches.open(cache_name).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

this.addEventListener('activate', function activator(event) {
    console.log('activate');
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys
                .filter(function(key) {
                    return key.indexOf(cache_name) !== 0;
                })
                .map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});





