self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/synth/',
        '/synth/index.html',
        '/synth/main.css',
        '/synth/model.js',
        '/synth/cookies.js',
        '/synth/oscillator.js',
        '/synth/note.js',
        '/synth/main.js'
      ]);
    })
  );
});