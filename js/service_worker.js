let prompt;
let version = 'v2'
	
if ('serviceWorker' in navigator) {
	
  	navigator.serviceWorker.register('/synth/sw.js', { scope: '/synth/' }).then(function(reg) {

	    if(reg.installing) {
	      console.log('Service worker installing');
	    } else if(reg.waiting) {
	      console.log('Service worker installed');
	    } else if(reg.active) {
	      console.log('Service worker active');
	    }

	}).catch(function(error) { // registration failed
	    console.log('Registration failed with ' + error);
	});
} else {
	console.log('Service worker not available');
}


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        //'/synth/',
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
        '/synth/js/main.js',
        '/synth/js/service_worker.js'
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

        caches.open(version).then(function (cache) {
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

window.addEventListener('beforeinstallprompt', function(e){
  	e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  	prompt = e;
});

window.addEventListener('appinstalled', async function(e) {
	//installButton.style.display = "none";
	install.showAlert(function(){
   		prompt.prompt();
	})
});



