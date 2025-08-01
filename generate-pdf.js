const puppeteer = require('puppeteer');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function generatePdf() {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1260, height: 1782 });

    console.log("Navigating to index.html...");
    await page.goto(`file://${__dirname}/index.html`, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
        if (typeof window.showSlide !== 'function') {
            const slides = document.querySelectorAll(".slide");
            window.showSlide = function(n) {
                slides.forEach((s, i) => {
                    s.style.display = i === n ? 'block' : 'none';
                });
            };
            window.showSlide(0);
        }
    });

    const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
    console.log(`Found ${slideCount} slides.`);

    const tempPdfPaths = [];
    const linkAreas = [];

    for (let i = 0; i < slideCount; i++) {
        const pageNum = i + 1;
        console.log(`Rendering slide ${pageNum}/${slideCount}...`);

        await page.evaluate((index) => window.showSlide(index), i);
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (i === 1) { // Table of Contents slide
            console.log("Capturing Table of Contents link coordinates...");
            const tocLinks = await page.evaluate(() => {
                const links = [];
                document.querySelectorAll('.toc-list-item').forEach(link => {
                    const rect = link.getBoundingClientRect();
                    const targetSlide = parseInt(link.getAttribute('data-slide-to'), 10);
                    if (!isNaN(targetSlide) && rect.width > 0 && rect.height > 0) {
                        links.push({
                            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                            targetPage: targetSlide + 1
                        });
                    }
                });
                return links;
            });
            if (tocLinks.length > 0) {
                linkAreas.push({ page: pageNum, links: tocLinks });
            }
        }

        const navLinks = [
            { rect: { x: 490, y: 1700, width: 60, height: 60 }, targetPage: pageNum - 1 },
            { rect: { x: 710, y: 1700, width: 60, height: 60 }, targetPage: pageNum + 1 }
        ].filter(link => link.targetPage > 0 && link.targetPage <= slideCount);

        if (navLinks.length > 0) {
            linkAreas.push({ page: pageNum, links: navLinks });
        }

        const tempPdfPath = path.join(__dirname, `temp-page-${pageNum}.pdf`);
        await page.pdf({ path: tempPdfPath, width: '1260px', height: '1782px', printBackground: true });
        tempPdfPaths.push(tempPdfPath);
        console.log(`Generated ${tempPdfPath}`);
    }
    await browser.close();

    console.log("Merging individual PDFs...");
    const finalPdfDoc = await PDFDocument.create();
    for (const tempPdfPath of tempPdfPaths) {
        const pdfBytes = await fs.readFile(tempPdfPath);
        const doc = await PDFDocument.load(pdfBytes);
        const [copiedPage] = await finalPdfDoc.copyPages(doc, [0]);
        finalPdfDoc.addPage(copiedPage);
    }

    console.log("Adding link annotations using low-level API...");
    const pages = finalPdfDoc.getPages();
    const pageHeight = pages[0].getHeight();

    linkAreas.forEach(area => {
        const pageIndex = area.page - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) return;
        const page = pages[pageIndex];

        area.links.forEach(link => {
            const y = pageHeight - link.rect.y - link.rect.height;
            const targetPageIndex = link.targetPage - 1;

            if (targetPageIndex < 0 || targetPageIndex >= pages.length) return;

            const targetPage = pages[targetPageIndex];
            const action = finalPdfDoc.context.obj({
                Type: 'Action',
                S: 'GoTo',
                D: [targetPage.ref, 'XYZ', null, pageHeight, null],
            });

            const rect = [
                link.rect.x,
                y,
                link.rect.x + link.rect.width,
                y + link.rect.height
            ];

            const annot = finalPdfDoc.context.obj({
                Type: 'Annot',
                Subtype: 'Link',
                Rect: rect,
                Border: [0, 0, 0], // No visible border
                Action: action,
            });

            page.node.addAnnot(annot);
        });
    });

    const finalPdfBytes = await finalPdfDoc.save();
    await fs.writeFile('handbook.pdf', finalPdfBytes);
    console.log("Final PDF 'handbook.pdf' created successfully.");

    console.log("Cleaning up temporary files...");
    for (const tempPdfPath of tempPdfPaths) {
        await fs.unlink(tempPdfPath);
    }
    console.log("Cleanup complete.");
}

generatePdf().catch(error => {
    console.error("An error occurred:", error);
    process.exit(1);
});
