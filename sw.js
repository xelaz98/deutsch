// Офлайн режим: мрежата е първа (винаги най-новото), кешът е резерва без интернет.
// Кешира кода, картинките и вече чутите звуци. Данните за прогреса са в localStorage — не зависят от това.
const CACHE = "deutsch-v1";
const CORE = ["./", "index.html", "translit.js", "emoji.js", "pics.js", "schemes.js", "data.js", "basics.js", "examples.js", "examples2.js", "core.js", "grammar.js", "explain.js",
  "exercises.js", "dialogs.js", "path.js", "check.js", "mem.js", "exam.js", "ws.js", "heute.js", "app.js"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then((res) => { if (res.ok && res.type === "basic") { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r, { ignoreSearch: false }).then((m) => m || caches.match("index.html"))));
});
