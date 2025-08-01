const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function generatePdf() {
    console.log("Launching browser...");
    // Note: Puppeteer downloads a compatible browser, so this should work in the environment.
    const browser = await puppeteer.launch({
        headless: true,
        // Arguments required for running in a sandboxed environment like a Docker container
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1260, height: 1782 });

    console.log("Navigating to local index.html...");
    // We use file:// protocol to open the local HTML file.
    await page.goto(`file://${__dirname}/index.html`, {
        // Wait until the network is idle, meaning all external resources like CSS and images are loaded.
        waitUntil: 'networkidle0'
    });

    console.log("Injecting CSS to disable animations for clean capture...");
    await page.addStyleTag({
        content: `
      /* Disable all transitions and animations */
      * { transition: none !important; animation: none !important; }
      /* Hide the original JS-based pagination controls */
      .pagination { display: none !important; }
    `
    });

    const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
    console.log(`Found ${slideCount} slides.`);

    const slideHtmls = [];
    for (let i = 0; i < slideCount; i++) {
        console.log(`Rendering slide ${i + 1}/${slideCount}...`);
        await page.evaluate((slideIndex) => {
            // This is the global function from the site's script.js
            showSlide(slideIndex);
        }, i);

        // Wait a moment for JS to render everything (random leaves, backgrounds, etc.)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const html = await page.evaluate(() => {
            const activeSlide = document.querySelector('.slide.active');
            return activeSlide ? activeSlide.outerHTML : '';
        });
        slideHtmls.push(html);
    }

    console.log("Assembling final HTML for PDF conversion...");
    let finalBodyHtml = '';
    for (let i = 0; i < slideHtmls.length; i++) {
        let html = slideHtmls[i];
        const pageNum = i + 1;

        // Convert the table of contents' JS links (data-slide-to) to standard PDF anchor links
        html = html.replace(/data-slide-to="(\d+)"/g, (match, slideIndex) => {
            return `href="#page-${parseInt(slideIndex, 10) + 1}"`;
        });

        // Create a new set of navigation controls specifically for the PDF
        const prevLink = pageNum > 1 ? `<a href="#page-${pageNum - 1}" style="color: white; margin-right: 40px; text-decoration: none;">&lt; PREV</a>` : '<span style="margin-right: 40px; opacity: 0.2;">&lt; PREV</span>';
        const nextLink = pageNum < slideHtmls.length ? `<a href="#page-${pageNum + 1}" style="color: white; margin-left: 40px; text-decoration: none;">NEXT &gt;</a>` : '<span style="margin-left: 40px; opacity: 0.2;">NEXT &gt;</span>';

        const pdfNav = `
            <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; font-family: 'South Park', sans-serif; font-size: 24px; color: var(--primary-color); text-shadow: 1px 1px 2px #000;">
                ${prevLink}
                <span>${pageNum} / ${slideHtmls.length}</span>
                ${nextLink}
            </div>
        `;

        // Wrap each slide's HTML in a container div that defines a PDF page, and add our new navigation
        finalBodyHtml += `<div id="page-${pageNum}" class="pdf-page">${html}${pdfNav}</div>`;
    }

    // Create the full HTML document structure
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Handbook PDF</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
        <style>
          html, body { margin: 0; padding: 0; background-color: #0d0d0d; }
          .pdf-page {
            width: 1260px;
            height: 1782px;
            overflow: hidden;
            position: relative;
            /* This is the key for PDF conversion: each .pdf-page will be a new page */
            page-break-after: always;
          }
          /* Ensure the .slide div inside our container is visible and sized correctly */
          .pdf-page .slide {
            display: block !important;
            opacity: 1 !important;
            width: 100%;
            height: 100%;
            position: static !important;
          }
        </style>
      </head>
      <body>
        ${finalBodyHtml}
      </body>
      </html>
    `;

    console.log("Setting final content for the browser...");
    // Load our newly created static HTML into the browser
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

    console.log("Generating PDF document...");
    await page.pdf({
        path: 'handbook.pdf',
        width: '1260px',
        height: '1782px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log("PDF generation complete: handbook.pdf");
    await browser.close();
}

generatePdf().catch(error => {
    console.error("An error occurred during PDF generation:", error);
    process.exit(1);
});
