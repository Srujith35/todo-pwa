// Save this file as: sw.js
const CACHE_NAME = 'todo-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  // If it's a Supabase API call, go straight to network
  if (e.request.url.includes('supabase.co')) {
    // You must explicitly return the fetch promise here
    e.respondWith(fetch(e.request));
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
