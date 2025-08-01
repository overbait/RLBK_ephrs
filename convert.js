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
      '--disable-gpu'
    ]
  });
  const page = await browser.newPage();

  // Read the HTML file
  const html = fs.readFileSync('index.html', 'utf-8');
  // Set the content of the page
  await page.setContent(html, {
    waitUntil: 'networkidle0',
    // Set the base URL to the project root
    baseURL: `file://${__dirname}/`
  });

  // Wait for the last slide's content to be ready
  await page.waitForSelector('#slide-12 .content-box', { timeout: 60000 });

  await page.emulateMediaType('screen');
  await page.pdf({
    path: 'presentation.pdf',
    format: 'A4',
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
