// Save this file as: sw.js

// ⚠️ CHANGE THIS VERSION TO 'todo-v2', 'todo-v3' ETC. TO TRIGGER UPDATE
const CACHE_NAME = 'todo-v2'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// 1. INSTALL: Cache files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. ACTIVATE: Delete old caches (CRITICAL FOR UPDATES)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});

// 3. FETCH: Serve from cache, but bypass cache for Supabase
self.addEventListener('fetch', (e) => {
  // If it's a Supabase API call, go straight to network
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(fetch(e.request));
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// 4. MESSAGE: Listen for the "Update" button click
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
