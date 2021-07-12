self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/synth/',
        //'/synth/img/screen.png',
        '/synth/index.html',
        '/synth/css/root.css',
        '/synth/css/main.css',
        '/synth/css/button.css',
        '/synth/css/slider.css',
        '/synth/css/select.css',
        '/synth/js/model.js',
        '/synth/js/cookies.js',
        '/synth/js/oscillator.js',
        '/synth/js/note.js',
        '/synth/js/main.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        console.log("here")

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        console.log("error")
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});