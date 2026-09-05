// Visual capture script for DAEDALUS's Gate 6 visual loop (Code->Render->
// Screenshot->Compare->Fix). Reuses this repo's own Playwright
// devDependency -- no new dependency added. Disables CSS
// animations/transitions before capture to reduce false-positive diffs
// from this site's known-fragile areas (WebGL hero canvas timing,
// auto-advancing carousels, Math.random() glitch-text effects, live
// relative timestamps in TrackRecord.tsx) -- investigation finding
// 2026-09-05, Gate 6 planning.
import { chromium } from 'playwright';

async function main() {
  const [, , url, outputPath] = process.argv;
  if (!url || !outputPath) {
    console.error('usage: node capture_screenshot.mjs <url> <output_path>');
    process.exit(1);
  }
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(JSON.stringify({ status: 'ok', path: outputPath }));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ status: 'error', message: err.message }));
  process.exit(1);
});
