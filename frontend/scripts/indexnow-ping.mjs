// IndexNow ping (2026-10-31): tells Bing, Yandex, Seznam and Naver about changed
// URLs right away instead of waiting for their next crawl. Run by hand AFTER a
// deploy, never from the build: `node scripts/indexnow-ping.mjs [url ...]`.
// Without arguments it submits every <loc> from the live sitemap.xml.
// The key file public/3f4a8eec2dc6f7c2312f06d43da2222c.txt must be live first (the engines fetch it).
const KEY = '3f4a8eec2dc6f7c2312f06d43da2222c'
const HOST = 'rfi-irfos.com'

let urls = process.argv.slice(2)
if (urls.length === 0) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
}
const keyLive = await fetch(`https://${HOST}/${KEY}.txt`).then(r => r.text()).catch(() => '')
if (keyLive.trim() !== KEY) {
  console.error('indexnow: key file not live yet, deploy first')
  process.exit(1)
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
})
console.log(`indexnow: ${urls.length} URLs -> HTTP ${res.status}`)
