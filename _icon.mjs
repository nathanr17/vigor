import { chromium } from 'playwright';
const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3bb6d5"/><stop offset="1" stop-color="#2a8eaa"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <g transform="translate(256 262) scale(${pad}) translate(-256 -262)">
    <path d="M150 168 L256 372 L362 168" fill="none" stroke="#ffffff" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="372" cy="150" r="34" fill="#ffc40e"/>
  </g>
</svg>`;
const browser = await chromium.launch();
const page = await browser.newPage();
async function shot(size, pad, out) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${svg(pad).replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } });
}
await shot(180, 1, 'icons/apple-touch-icon.png');
await shot(192, 1, 'icons/icon-192.png');
await shot(512, 1, 'icons/icon-512.png');
await shot(512, 0.78, 'icons/icon-maskable-512.png');
await browser.close();
console.log('icons ok');
