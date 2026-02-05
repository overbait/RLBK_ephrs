const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--allow-file-access-from-files'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1260, height: 1782 });

  // Read the HTML file and the CSS file
  let html = fs.readFileSync('index.html', 'utf-8');
  const css = fs.readFileSync('style.css', 'utf-8');

  // Inline the CSS
  html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`);

  // Set the content of the page
  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });

  // Wait for the last slide's content to be ready
  await page.waitForSelector('#slide-12 .content-box', { timeout: 60000 });
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
            })
        )
    );
  });

  await page.emulateMediaType('print');
  await page.pdf({
    path: 'presentation.pdf',
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    timeout: 60000,
    quality: 50
  });

  await browser.close();
})();
