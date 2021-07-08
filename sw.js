self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/synth/',
        //'/synth/img/screen.png',
        '/synth/index.html',
        '/synth/css/main.css',
        '/synth/js/model.js',
        '/synth/js/cookies.js',
        '/synth/js/oscillator.js',
        '/synth/js/note.js',
        '/synth/js/main.js'
      ]);
    })
  );
});