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

        console.log("Injecting temporary HTML links with robust logic...");
        await page.evaluate((currentPage, totalPages) => {
            const createLinkOverlay = (rect, targetPage) => {
                if (!rect || targetPage < 1 || targetPage > totalPages) return;

                const link = document.createElement('a');
                link.href = `urn:pdf-page:${targetPage}`;
                link.style.position = 'absolute';
                link.style.left = `${rect.x}px`;
                link.style.top = `${rect.y}px`;
                link.style.width = `${rect.width}px`;
                link.style.height = `${rect.height}px`;
                link.style.zIndex = '100';
                // Append to body to ensure it's on top of everything in a known context
                document.body.appendChild(link);
            };

            // 1. Table of Contents links (using getBoundingClientRect)
            if (currentPage === 2) {
                document.querySelectorAll('.toc-list-item').forEach(item => {
                    const targetSlide = parseInt(item.getAttribute('data-slide-to'), 10);
                    if (!isNaN(targetSlide)) {
                        createLinkOverlay(item.getBoundingClientRect(), targetSlide + 1);
                    }
                });
            }

            // 2. Page number links (using getBoundingClientRect)
            document.querySelectorAll('.page-indicator').forEach(indicator => {
                const targetPage = parseInt(indicator.textContent, 10);
                if (!isNaN(targetPage)) {
                    createLinkOverlay(indicator.getBoundingClientRect(), targetPage);
                }
            });

            // 3. Prev/Next Icon links (using fixed coordinates as a fallback)
            // These coordinates are based on visual inspection of the layout.
            const prevIconRect = { x: 530, y: 1700, width: 60, height: 60 };
            const nextIconRect = { x: 670, y: 1700, width: 60, height: 60 };

            if (currentPage > 1) {
                createLinkOverlay(prevIconRect, currentPage - 1);
            }
            if (currentPage < totalPages) {
                createLinkOverlay(nextIconRect, currentPage + 1);
            }

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
