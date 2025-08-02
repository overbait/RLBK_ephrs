const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function generatePdf() {
    console.log("--- Starting PDF Generation with Correct Page Loading Strategy ---");
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    const slideCount = 13;
    const tempPdfPaths = [];

    for (let i = 0; i < slideCount; i++) {
        const pageNum = i + 1;
        console.log(`Processing slide ${pageNum}/${slideCount}...`);

        // Create a new, clean page for each slide
        const page = await browser.newPage();
        await page.setViewport({ width: 1260, height: 1782 });

        // Use goto() to ensure the page's own scripts (like script.js) are executed
        await page.goto(`file://${__dirname}/index.html`, { waitUntil: 'networkidle0' });

        // Now that the page is loaded and its scripts have run,
        // we can manipulate it to show the correct slide and add our links.
        await page.evaluate((currentPage, totalPages) => {
            // 1. Show the correct slide
            if (typeof window.showSlide === 'function') {
                window.showSlide(currentPage - 1);
            }

            // 2. Create Link Overlays
            const activeSlide = document.querySelector('.slide.active');
            if (!activeSlide) return;

            const createLinkOverlay = (element, targetPage) => {
                if (!element || targetPage < 1 || targetPage > totalPages) return;

                const rect = element.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;

                const link = document.createElement('a');
                link.href = `urn:pdf-page:${targetPage}`;
                link.style.position = 'absolute';
                link.style.left = `${rect.left}px`;
                link.style.top = `${rect.top}px`;
                link.style.width = `${rect.width}px`;
                link.style.height = `${rect.height}px`;
                link.style.zIndex = '100';

                activeSlide.appendChild(link);
            };

            // Link TOC
            if (currentPage === 2) {
                activeSlide.querySelectorAll('.toc-list-item').forEach(item => {
                    const targetSlide = parseInt(item.getAttribute('data-slide-to'), 10);
                    if (!isNaN(targetSlide)) createLinkOverlay(item, targetSlide + 1);
                });
            }

            // Link page numbers
            activeSlide.querySelectorAll('.page-indicator').forEach(indicator => {
                const targetPage = parseInt(indicator.textContent, 10);
                if (!isNaN(targetPage)) createLinkOverlay(indicator, targetPage);
            });

            // Link Prev/Next Icons
            const prevIcon = activeSlide.querySelector('.pagination .prev img');
            if (prevIcon && currentPage > 1) createLinkOverlay(prevIcon, currentPage - 1);

            const nextIcon = activeSlide.querySelector('.pagination .next img');
            if (nextIcon && currentPage < totalPages) createLinkOverlay(nextIcon, currentPage + 1);

        }, pageNum, slideCount);

        await new Promise(resolve => setTimeout(resolve, 500));

        const tempPdfPath = path.join(__dirname, `temp-page-${pageNum}.pdf`);
        await page.pdf({ path: tempPdfPath, width: '1260px', height: '1782px', printBackground: true });
        tempPdfPaths.push(tempPdfPath);
        console.log(`Generated ${tempPdfPath}`);
        await page.close();
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

    console.log("Updating link annotations with correct GoTo actions...");
    const pages = finalPdfDoc.getPages();
    for (const page of pages) {
        const annots = page.node.Annots()?.asArray() || [];
        for (const annotRef of annots) {
            const annot = finalPdfDoc.context.lookup(annotRef);
            const action = annot.get(finalPdfDoc.context.obj('A'));

            if (action?.get(finalPdfDoc.context.obj('S'))?.toString() === '/URI') {
                const uri = action.get(finalPdfDoc.context.obj('URI'))?.toString();

                if (uri && uri.includes('urn:pdf-page:')) {
                    const cleanedUri = uri.substring(1, uri.length - 1);
                    const targetPageNum = parseInt(cleanedUri.substring('urn:pdf-page:'.length), 10);

                    if (!isNaN(targetPageNum) && targetPageNum > 0 && targetPageNum <= pages.length) {
                        const targetPageIndex = targetPageNum - 1;
                        const newAction = finalPdfDoc.context.obj({
                            Type: 'Action',
                            S: 'GoTo',
                            D: [pages[targetPageIndex].ref, 'XYZ', null, null, null],
                        });
                        annot.set(finalPdfDoc.context.obj('A'), newAction);
                    }
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
