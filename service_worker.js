const CACHE_NAME = 'v0';
const CACHE = [
        '/synth/index.html',
        '/synth/css/root.css',
        '/synth/css/main.css',
        '/synth/css/button.css',
        '/synth/css/slider.css',
        '/synth/css/select.css',
        '/synth/css/header.css',
        '/synth/css/alert.css',
        '/synth/js/prototypes.js',
        '/synth/js/model.js',
        '/synth/js/storage.js',
        '/synth/js/oscillator.js',
        '/synth/js/note.js',
        '/synth/js/alert.js',
        '/synth/js/information.js',
        '/synth/js/main.js',
        '/synth/js/install.js'
      ];
	
this.addEventListener('install', function(event) {
    console.log('synth: install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHE);
        })
    );
});

this.addEventListener('fetch', function(event) {
    console.log('synth: fetch');
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
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
    console.log('synth: activate');
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys
                .filter(function(key) {
                    return key.indexOf(CACHE_NAME) !== 0;
                })
                .map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});




