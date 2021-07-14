
const cache_name = 'v2'
	
self.addEventListener('install', function(event) {
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
        //,
        //'/synth/js/service_worker.js'
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
        
        console.log("fetching")

        caches.open(cache_name).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        console.log("fetching error")
        return undefined;
      });
    }
  }));
});

this.addEventListener('activate', function activator(event) {
    console.log('activate!');

    // Here we see another wait until....
    event.waitUntil(

        // I won't go too much into detail here because 
        // there's a lot of stuff you can look up yourself // (filter() and map() being two of them), but 
        // basically this function is in case there's 
        // previously cached content, then we get rid of 
        // it and populate it with the newest cached 
        // content. This is only if you need them to 
        // install a v2, v3, v4, etc... In a nutshell it 
        // wipes out their previous cache and replaces it 
        // with the new version. 
        
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





