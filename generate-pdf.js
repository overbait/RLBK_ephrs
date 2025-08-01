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

        await page.evaluate((index) => {
            if (typeof window.showSlide === 'function') {
                window.showSlide(index);
            }
        }, i);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Injecting temporary HTML links with refined logic...");
        await page.evaluate((currentPage, totalPages) => {
            const createLink = (element, targetPage) => {
                if (!element) return;
                const rect = element.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;

                const link = document.createElement('a');
                link.href = `urn:pdf-page:${targetPage}`;
                link.style.position = 'absolute';
                link.style.left = `${element.offsetLeft}px`;
                link.style.top = `${element.offsetTop}px`;
                link.style.width = `${element.offsetWidth}px`;
                link.style.height = `${element.offsetHeight}px`;
                link.style.zIndex = '100'; // Ensure link is on top

                // Find the closest positioned ancestor to append the link to
                let parent = element.parentElement;
                while (parent) {
                    const position = window.getComputedStyle(parent).position;
                    if (position === 'relative' || position === 'absolute' || position === 'fixed') {
                        break;
                    }
                    parent = parent.parentElement;
                }
                (parent || element.parentElement).appendChild(link);
            };

            // 1. Refined Table of Contents links
            if (currentPage === 2) {
                document.querySelectorAll('.toc-list-item').forEach(item => {
                    const targetSlide = parseInt(item.getAttribute('data-slide-to'), 10);
                    if (!isNaN(targetSlide)) {
                        // This creates a link that covers the entire item without disrupting its children
                        createLink(item, targetSlide + 1);
                    }
                });
            }

            // 2. Refined Pagination Icon and Number Links
            const prevIcon = document.querySelector('.pagination .prev img');
            if (prevIcon && currentPage > 1) createLink(prevIcon, currentPage - 1);

            const nextIcon = document.querySelector('.pagination .next img');
            if (nextIcon && currentPage < totalPages) createLink(nextIcon, currentPage + 1);

            document.querySelectorAll('.page-indicator').forEach(indicator => {
                const targetPage = parseInt(indicator.textContent, 10);
                if (!isNaN(targetPage)) createLink(indicator, targetPage);
            });

        }, pageNum, slideCount);

        const tempPdfPath = path.join(__dirname, `temp-page-${pageNum}.pdf`);
        await page.pdf({ path: tempPdfPath, width: '1260px', height: '1782px', printBackground: true });
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
