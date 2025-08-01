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

        console.log("Injecting temporary HTML links...");
        await page.evaluate((currentPage, totalPages) => {
            const wrapInLink = (element, targetPage) => {
                if (!element || element.querySelector('a')) return;
                const link = document.createElement('a');
                link.href = `urn:pdf-page:${targetPage}`;

                // Wrap the content of the element in the link
                while (element.firstChild) {
                    link.appendChild(element.firstChild);
                }
                element.appendChild(link);
            };

            // Wrap TOC items
            if (currentPage === 2) {
                document.querySelectorAll('.toc-list-item').forEach(item => {
                    const targetSlide = parseInt(item.getAttribute('data-slide-to'), 10);
                    if (!isNaN(targetSlide)) {
                        wrapInLink(item, targetSlide + 1);
                    }
                });
            }

            // Wrap pagination icons
            const prevIcon = document.querySelector('.pagination .prev');
            if (prevIcon && currentPage > 1) wrapInLink(prevIcon, currentPage - 1);

            const nextIcon = document.querySelector('.pagination .next');
            if (nextIcon && currentPage < totalPages) wrapInLink(nextIcon, currentPage + 1);

            // Wrap pagination numbers
            document.querySelectorAll('.page-indicator').forEach(indicator => {
                const targetPage = parseInt(indicator.textContent, 10);
                if (!isNaN(targetPage)) wrapInLink(indicator, targetPage);
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
        // Correctly get the array of annotation references
        const annots = page.node.Annots()?.asArray() || [];

        for (const annotRef of annots) {
            const annot = finalPdfDoc.context.lookup(annotRef);
            const action = annot.get(finalPdfDoc.context.obj('A'));

            // Check if it's a URI action
            if (action?.get(finalPdfDoc.context.obj('S'))?.toString() === '/URI') {
                const uri = action.get(finalPdfDoc.context.obj('URI'))?.toString();

                // Check if it's one of our special placeholder links
                if (uri && uri.includes('urn:pdf-page:')) {
                    // pdf-lib wraps strings in parentheses, so we remove them.
                    const cleanedUri = uri.substring(1, uri.length - 1);
                    const targetPageNum = parseInt(cleanedUri.substring('urn:pdf-page:'.length), 10);

                    if (!isNaN(targetPageNum) && targetPageNum > 0 && targetPageNum <= pages.length) {
                        const targetPageIndex = targetPageNum - 1;

                        // Create a new GoTo action pointing to the correct page
                        const newAction = finalPdfDoc.context.obj({
                            Type: 'Action',
                            S: 'GoTo',
                            D: [pages[targetPageIndex].ref, 'XYZ', null, null, null],
                        });

                        // Replace the old URI action with our new GoTo action
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
