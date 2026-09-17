const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer");

const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;

async function main() {
  const scene = process.argv[2] || "invited_players";
  const totalFramesArg = process.argv[3];
  const outputDirArg = process.argv[4];

  const motionDir = __dirname;
  const indexPath = path.join(motionDir, "index.html");
  const outputDir = outputDirArg
    ? path.resolve(process.cwd(), outputDirArg)
    : path.join(motionDir, "output", scene);

  await fs.mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: FRAME_WIDTH, height: FRAME_HEIGHT, deviceScaleFactor: 1 });

    const url = `file://${indexPath}?scene=${encodeURIComponent(scene)}&frame=0`;
    await page.goto(url, { waitUntil: "networkidle0" });

    const meta = await page.evaluate(() => window.getSceneMeta());
    const totalFrames = totalFramesArg ? Number(totalFramesArg) : meta.totalFrames;

    for (let frame = 0; frame < totalFrames; frame += 1) {
      await page.evaluate((value) => window.setFrame(value), frame);
      await page.screenshot({
        path: path.join(outputDir, `frame-${String(frame).padStart(4, "0")}.png`),
        omitBackground: true
      });
    }

    console.log(`Rendered scene "${scene}" to ${outputDir} (${totalFrames} frames @ ${meta.fps} fps)`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
