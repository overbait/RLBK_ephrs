const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');

async function generatePdf() {
  console.log('--- Starting PDF Generation with Simple and Robust Strategy ---');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(120000);
  await page.setViewport({ width: 1260, height: 1782 });

  console.log('Navigating to index.html...');
  await page.goto(`file://${__dirname}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('.slide').length > 0);
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`Found ${slideCount} slides.`);

  const tempPdfPaths = [];

  for (let i = 0; i < slideCount; i += 1) {
    const pageNum = i + 1;
    console.log(`Processing slide ${pageNum}/${slideCount}...`);

    await page.evaluate((index) => {
      const slides = Array.from(document.querySelectorAll('.slide'));
      slides.forEach((slide, slideIndex) => {
        if (slideIndex === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
    }, i);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.evaluate((currentPage, totalPages) => {
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

      activeSlide.querySelectorAll('.toc-list-item').forEach((item) => {
        const href = item.getAttribute('href') || '';
        const targetIndex = parseInt(href.replace('#slide-', ''), 10);
        if (!Number.isNaN(targetIndex)) createLinkOverlay(item, targetIndex + 1);
      });

      activeSlide.querySelectorAll('.page-indicator').forEach((indicator) => {
        const targetPage = parseInt(indicator.textContent, 10);
        if (!Number.isNaN(targetPage)) createLinkOverlay(indicator, targetPage);
      });

      const prevIcon = activeSlide.querySelector('.pagination .prev img');
      if (prevIcon && currentPage > 1) createLinkOverlay(prevIcon, currentPage - 1);

      const nextIcon = activeSlide.querySelector('.pagination .next img');
      if (nextIcon && currentPage < totalPages) createLinkOverlay(nextIcon, currentPage + 1);
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

  console.log('--- Merging PDFs and Correcting Links ---');
  const finalPdfDoc = await PDFDocument.create();
  for (const tempPdfPath of tempPdfPaths) {
    const pdfBytes = await fs.readFile(tempPdfPath);
    const doc = await PDFDocument.load(pdfBytes);
    const [copiedPage] = await finalPdfDoc.copyPages(doc, [0]);
    finalPdfDoc.addPage(copiedPage);
  }

  console.log('Updating link annotations with correct GoTo actions...');
  const pages = finalPdfDoc.getPages();
  for (const pageItem of pages) {
    const annots = pageItem.node.Annots()?.asArray() || [];
    for (const annotRef of annots) {
      const annot = finalPdfDoc.context.lookup(annotRef);
      const action = annot.get(finalPdfDoc.context.obj('A'));

      if (action?.get(finalPdfDoc.context.obj('S'))?.toString() === '/URI') {
        const uri = action.get(finalPdfDoc.context.obj('URI'))?.toString();

        if (uri && uri.includes('urn:pdf-page:')) {
          const cleanedUri = uri.substring(1, uri.length - 1);
          const targetPageNum = parseInt(cleanedUri.substring('urn:pdf-page:'.length), 10);

          if (!Number.isNaN(targetPageNum) && targetPageNum > 0 && targetPageNum <= pages.length) {
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

  const finalPdfBytes = await finalPdfDoc.save({ useObjectStreams: false });
  await fs.writeFile('handbook.pdf', finalPdfBytes);
  console.log("Final PDF 'handbook.pdf' created successfully.");

  await optimizeWithGhostscript('handbook.pdf', 'handbook-optimized.pdf');

  console.log('--- Cleaning Up Temporary Files ---');
  for (const tempPdfPath of tempPdfPaths) {
    await fs.unlink(tempPdfPath);
  }
  console.log('Cleanup complete.');
}

function optimizeWithGhostscript(inputPath, outputPath) {
  return new Promise((resolve) => {
    const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(
          'Ghostscript optimization failed. Using unoptimized PDF. Make sure Ghostscript is installed and in your PATH.',
          stderr,
        );
        resolve();
        return;
      }

      fs.access(outputPath)
        .then(() => {
          console.log(`Ghostscript optimization successful. Optimized file saved as ${outputPath}`);
          resolve();
        })
        .catch((err) => {
          console.warn(
            `Ghostscript ran but the output file '${outputPath}' was not found. Using unoptimized PDF.`,
            err,
          );
          resolve();
        });
    });
  });
}

generatePdf().catch((error) => {
  console.error('An error occurred during PDF generation:', error);
  process.exit(1);
});
