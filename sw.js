// Offline-Speicher: Seite, Bilder und Musik werden beim ersten Besuch abgelegt.
const V='tempel-v4';
const BASE=self.registration.scope;
const u=p=>new URL(p,BASE).href;
const FILES=['./','index.html','manifest.webmanifest','assets/drache.png','assets/tempel.jpg','assets/icon-192.png','assets/icon-512.png','assets/apple-touch-icon.png','assets/musik-theta-loop.mp3'].map(u);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const isPage=e.request.mode==='navigate';
  e.respondWith(isPage
    ? fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(u('index.html'),c));return r}).catch(()=>caches.match(u('index.html')))
    : caches.match(e.request).then(r=>r||fetch(e.request)));
});
