const CACHE_NAME = 'todo-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2' // Cache the library
];

// 1. Install Event: Cache the app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Fetch Event: Serve from cache if offline
self.addEventListener('fetch', (e) => {
  // If it's a Supabase API call, go to network (don't cache database data rigidly)
  if (e.request.url.includes('supabase.co')) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});