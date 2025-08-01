const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Construct the absolute path to the HTML file
  const filePath = path.resolve(__dirname, 'index.html');

  await page.goto(`file://${filePath}`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

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
