#!/usr/bin/env node
// Renders mock.html into the store screenshots at 2400x1800 (AMO's maximum).
//
// Usage: node store-assets/mock/render.js
// Needs Playwright with Chromium: npx playwright install chromium

const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const names = { 1: "open-in-maps", 2: "link-locations" };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2,
  });
  const mock = pathToFileURL(path.join(__dirname, "mock.html")).href;
  for (const [shot, name] of Object.entries(names)) {
    await page.goto(`${mock}?shot=${shot}`);
    await page.waitForSelector("body[data-ready]");
    const out = path.join(__dirname, "..", `firefox-${shot}-${name}.png`);
    await page.screenshot({ path: out });
    console.log(`Wrote ${path.relative(process.cwd(), out)}`);
  }
  await browser.close();
})();
