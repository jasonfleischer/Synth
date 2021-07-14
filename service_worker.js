
const cache_name = 'v3'
	
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name).then(function(cache) {
      return cache.addAll([
        '/synth/',
        '/synth/index.html',
        '/synth/css/root.css',
        '/synth/css/main.css',
        '/synth/css/button.css',
        '/synth/css/slider.css',
        '/synth/css/select.css',
        '/synth/css/header.css',
        '/synth/css/alert.css',
        '/synth/js/prototype.js',
        '/synth/js/model.js',
        '/synth/js/cookies.js',
        '/synth/js/oscillator.js',
        '/synth/js/note.js',
        '/synth/js/alert.js',
        '/synth/js/information.js',
        '/synth/js/install.js',
        '/synth/js/main.js'
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





