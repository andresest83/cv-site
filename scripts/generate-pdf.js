/**
 * Generate PDF versions of the CV using Puppeteer.
 * Serves the built dist/ folder locally, then prints to PDF
 * with print media emulation (same as browser Ctrl+P).
 *
 * Output:
 *   dist/files/CV_<Name>.pdf    (English)
 *   dist/files/CV_<Name>_DE.pdf (German)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUTPUT_DIR = path.join(DIST, 'files');
const PORT = 9333;

const dataRoot = process.env.CV_DATA_DIR || path.join(ROOT, 'data');
const hero = yaml.load(
  fs.readFileSync(path.join(dataRoot, 'en', 'hero.yaml'), 'utf8')
);
// ASCII-fold the filename only: the displayed name keeps its accents.
// Non-ASCII filenames get mangled in the recruiter -> ATS upload chain.
const fullName = hero.profile.name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Za-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

// Derive pages from the built locale list. Hardcoding '/de/' here silently
// renders a 404 page to PDF when that locale is not built, because
// page.goto() does not throw on a 404.
const i18n = yaml.load(
  fs.readFileSync(path.join(dataRoot, 'i18n.yaml'), 'utf8')
);
const locales =
  Array.isArray(i18n.locales) && i18n.locales.length ? i18n.locales : ['en'];

const PAGES = locales.map(loc =>
  loc === 'en'
    ? { url: '/', output: `CV_${fullName}.pdf` }
    : { url: `/${loc}/`, output: `CV_${fullName}_${loc.toUpperCase()}.pdf` }
);

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webp': 'image/webp',
};

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      // Serve index.html for directory paths
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      const filePath = path.join(DIST, urlPath);
      if (!filePath.startsWith(DIST)) {
        res.writeHead(403);
        return res.end();
      }
      const ext = path.extname(filePath);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          return res.end();
        }
        res.writeHead(200, {
          'Content-Type': MIME[ext] || 'application/octet-stream',
        });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function generatePdf() {
  const server = await startServer();

  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const { url, output } of PAGES) {
      const outputFile = path.join(OUTPUT_DIR, output);
      const page = await browser.newPage();

      // Emulate print media to trigger @media print styles
      await page.emulateMediaType('print');

      await page.goto(`http://localhost:${PORT}${url}`, {
        waitUntil: 'networkidle0',
      });

      await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '8mm',
          right: '8mm',
          bottom: '8mm',
          left: '8mm',
        },
      });

      await page.close();
      console.log(
        `✓ PDF generated: ${path.relative(process.cwd(), outputFile)}`
      );
    }

    await browser.close();
  } finally {
    server.close();
  }
}

generatePdf().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
