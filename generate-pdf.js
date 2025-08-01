const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function generatePdf() {
    console.log("--- Starting PDF Generation ---");
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1260, height: 1782 });

    console.log("Navigating to index.html...");
    await page.goto(`file://${__dirname}/index.html`, { waitUntil: 'networkidle0' });

    const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
    console.log(`Found ${slideCount} slides.`);

    const tempPdfPaths = [];

    for (let i = 0; i < slideCount; i++) {
        const pageNum = i + 1;
        console.log(`Rendering slide ${pageNum}/${slideCount}...`);

        // Show the correct slide
        await page.evaluate((index) => {
            if (typeof window.showSlide === 'function') {
                window.showSlide(index);
            }
        }, i);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for render

        // --- NEW STRATEGY: Inject HTML links before printing ---
        console.log("Injecting temporary HTML links...");
        await page.evaluate((currentPage, totalPages) => {
            // Make a helper to wrap elements in a link
            const wrapInLink = (element, targetPage) => {
                if (!element) return;
                const link = document.createElement('a');
                // Using a URN is a standard way to create special link types
                link.href = `urn:pdf-page:${targetPage}`;
                link.style.display = 'block'; // Make the link cover the whole element
                link.style.height = '100%';
                element.style.position = 'relative'; // Ensure the link positions correctly
                element.appendChild(link);
            };

            // 1. Table of Contents Links
            if (currentPage === 2) { // TOC is on slide index 1 (page 2)
                document.querySelectorAll('.toc-list-item').forEach(item => {
                    const targetSlide = parseInt(item.getAttribute('data-slide-to'), 10);
                    if (!isNaN(targetSlide)) {
                        wrapInLink(item, targetSlide + 1);
                    }
                });
            }

            // 2. Pagination Icon Links (Prev/Next)
            const prevIcon = document.querySelector('.pagination .prev');
            const nextIcon = document.querySelector('.pagination .next');
            if (prevIcon && currentPage > 1) {
                wrapInLink(prevIcon, currentPage - 1);
            }
            if (nextIcon && currentPage < totalPages) {
                wrapInLink(nextIcon, currentPage + 1);
            }

            // 3. Pagination Page Number Links
            document.querySelectorAll('.page-indicator').forEach(indicator => {
                const targetPage = parseInt(indicator.textContent, 10);
                if (!isNaN(targetPage)) {
                    wrapInLink(indicator, targetPage);
                }
            });

        }, pageNum, slideCount);

        const tempPdfPath = path.join(__dirname, `temp-page-${pageNum}.pdf`);
        await page.pdf({
            path: tempPdfPath,
            width: '1260px',
            height: '1782px',
            printBackground: true,
        });
        tempPdfPaths.push(tempPdfPath);
        console.log(`Generated ${tempPdfPath}`);
    }
    await browser.close();

    console.log("--- Merging PDFs and Correcting Links ---");
    const finalPdfDoc = await PDFDocument.create();
    for (const tempPdfPath of tempPdfPaths) {
        const pdfBytes = await fs.readFile(tempPdfPath);
        const doc = await PDFDocument.load(pdfBytes);
        const [copiedPage] = await finalPdfDoc.copyPages(doc, [0]);
        finalPdfDoc.addPage(copiedPage);
    }

    // --- NEW STRATEGY: Find and update link annotations ---
    const pages = finalPdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const annots = page.getAnnotations();

        for (const annot of annots) {
            const uri = annot.getURI();
            if (uri && uri.startsWith('urn:pdf-page:')) {
                const targetPageNum = parseInt(uri.substring('urn:pdf-page:'.length), 10);
                if (!isNaN(targetPageNum) && targetPageNum > 0 && targetPageNum <= pages.length) {
                    const targetPageIndex = targetPageNum - 1;
                    // Modify the annotation to be a GoTo action instead of a URI action
                    annot.setGoTo(pages[targetPageIndex]);
                }
            }
        }
    }

    const finalPdfBytes = await finalPdfDoc.save();
    await fs.writeFile('handbook.pdf', finalPdfBytes);
    console.log("Final PDF 'handbook.pdf' created successfully.");

    console.log("--- Cleaning Up Temporary Files ---");
    for (const tempPdfPath of tempPdfPaths) {
        await fs.unlink(tempPdfPath);
    }
    console.log("Cleanup complete.");
}

generatePdf().catch(error => {
    console.error("An error occurred during PDF generation:", error);
    process.exit(1);
});
