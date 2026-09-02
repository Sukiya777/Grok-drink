/* 夜酌 Service Worker
 * 目标：首访后 51 张插画 + 壳资源进缓存，二次打开秒进、离线可用。
 * 策略：
 *   - install 预缓存：壳(html/图标/manifest) + 全量插画（约 1.2MB）
 *   - fetch：导航请求 network-first（改版即见新壳），离线回退缓存 /index.html；
 *            同源静态资源与 Google Fonts 字体 stale-while-revalidate（先给旧的，后台补新）
 *   - activate 清旧版本桶
 * 更新：改动插画/壳后把 CACHE 版本号的尾号 +1 即可整体换血。
 */
const CACHE = "night-pour-v1";
const ARTS = [
  "/images/cocktails/amaretto-sour.webp",
  "/images/cocktails/americano.webp",
  "/images/cocktails/aperol-spritz.webp",
  "/images/cocktails/aviation.webp",
  "/images/cocktails/bees-knees.webp",
  "/images/cocktails/between-the-sheets.webp",
  "/images/cocktails/bloody-mary.webp",
  "/images/cocktails/boulevardier.webp",
  "/images/cocktails/brandy-alexander.webp",
  "/images/cocktails/citrus-highball.webp",
  "/images/cocktails/coconut-cooler.webp",
  "/images/cocktails/cosmopolitan.webp",
  "/images/cocktails/cuba-libre.webp",
  "/images/cocktails/cucumber-tonic.webp",
  "/images/cocktails/daiquiri.webp",
  "/images/cocktails/dark-n-stormy.webp",
  "/images/cocktails/el-diablo.webp",
  "/images/cocktails/espresso-martini.webp",
  "/images/cocktails/french-75.webp",
  "/images/cocktails/gin-tonic.webp",
  "/images/cocktails/hemingway.webp",
  "/images/cocktails/kir-royale.webp",
  "/images/cocktails/last-word.webp",
  "/images/cocktails/mai-tai.webp",
  "/images/cocktails/manhattan.webp",
  "/images/cocktails/margarita.webp",
  "/images/cocktails/martini.webp",
  "/images/cocktails/mint-julep.webp",
  "/images/cocktails/mojito.webp",
  "/images/cocktails/moscow-mule.webp",
  "/images/cocktails/negroni.webp",
  "/images/cocktails/new-york-sour.webp",
  "/images/cocktails/old-fashioned.webp",
  "/images/cocktails/paloma.webp",
  "/images/cocktails/penicillin.webp",
  "/images/cocktails/pina-colada.webp",
  "/images/cocktails/pisco-sour.webp",
  "/images/cocktails/ranch-water.webp",
  "/images/cocktails/sazerac.webp",
  "/images/cocktails/sbagliato.webp",
  "/images/cocktails/shirley-temple.webp",
  "/images/cocktails/sidecar.webp",
  "/images/cocktails/sunset-grove.webp",
  "/images/cocktails/tequila-sunrise.webp",
  "/images/cocktails/tom-collins.webp",
  "/images/cocktails/tommys-margarita.webp",
  "/images/cocktails/vieux-carre.webp",
  "/images/cocktails/virgin-mojito.webp",
  "/images/cocktails/vodka-martini.webp",
  "/images/cocktails/whiskey-sour.webp",
  "/images/cocktails/white-russian.webp",
];

const SHELL = [
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll(SHELL.concat(ARTS)),
      )
      .catch(() => {}) // 个别资源 404 不阻断安装
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // 页面导航：优先网络（保证改版即时可见），断网回退缓存壳
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html").then((r) => r || Response.error())),
    );
    return;
  }

  // 静态资源 / 字体：stale-while-revalidate
  if (
    url.origin === self.location.origin ||
    url.hostname.endsWith("gstatic.com") ||
    url.hostname.endsWith("googleapis.com")
  ) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok && (res.type === "basic" || res.type === "cors")) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
