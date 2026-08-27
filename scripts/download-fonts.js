import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FONTS_DIR = path.join(ROOT, 'vendor', 'fonts');

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          return downloadFile(res.headers.location, dest)
            .then(resolve)
            .catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(
            new Error(`Failed to download ${url}: status ${res.statusCode}`)
          );
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', reject);
  });
}

async function fetchGoogleFont(cssUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(
        cssUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
        res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => resolve(data));
        }
      )
      .on('error', reject);
  });
}

async function main() {
  console.log('Fetching Google Fonts CSS...');
  const css = await fetchGoogleFont(
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap'
  );

  // Parse @font-face blocks
  const blocks = css.split('@font-face').slice(1);

  let fontCssOutput =
    '/* Self-hosted fonts — Plus Jakarta Sans & JetBrains Mono */\n';
  let count = 0;

  for (const block of blocks) {
    // Check if it's latin / latin-ext
    const isLatin = block.includes('unicode-range')
      ? block.includes('U+0000-00FF') ||
        block.includes('U+0100-02BA') ||
        block.includes('U+0100-02AF') ||
        block.includes('U+0102-0103')
      : true;

    if (isLatin) {
      const familyMatch = block.match(/font-family:\s*['"]([^'"]+)['"]/);
      const weightMatch = block.match(/font-weight:\s*([0-9]+)/);
      const styleMatch = block.match(/font-style:\s*([a-z]+)/);
      const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
      const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);

      if (familyMatch && weightMatch && urlMatch) {
        const family = familyMatch[1];
        const weight = weightMatch[1];
        const style = styleMatch ? styleMatch[1] : 'normal';
        const url = urlMatch[1];
        const range = rangeMatch ? rangeMatch[1] : null;

        const safeFamily = family.toLowerCase().replace(/\s+/g, '-');
        const isExt =
          range && (range.includes('U+0100') || range.includes('U+0102'));
        const filename = `${safeFamily}-${weight}${
          style === 'italic' ? '-italic' : ''
        }${isExt ? '-ext' : ''}.woff2`;
        const destPath = path.join(FONTS_DIR, filename);

        console.log(`Downloading ${filename}...`);
        await downloadFile(url, destPath);
        count++;

        fontCssOutput += `@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/vendor/fonts/${filename}') format('woff2');
  ${range ? `unicode-range: ${range};` : ''}
}\n\n`;
      }
    }
  }

  const cssPath = path.join(ROOT, 'css', 'fonts.css');
  fs.writeFileSync(cssPath, fontCssOutput.trim() + '\n');
  console.log(
    `✓ ${count} fonts downloaded to vendor/fonts and generated css/fonts.css`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
