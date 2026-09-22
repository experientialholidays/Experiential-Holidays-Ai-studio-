import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'public');
const destDir = path.join(process.cwd(), 'dist');

const filesToCopy = ['config.js', 'navbar.js', 'footer.js', 'search-tracker.js', 'robots.txt'];

for (const file of filesToCopy) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to dist/`);
  } else {
    console.warn(`File ${file} does not exist in public/`);
  }
}

// Copy assets directory recursively
const srcAssets = path.join(srcDir, 'assets');
const destAssets = path.join(destDir, 'assets');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const srcPath = path.join(from, element);
    const destPath = path.join(to, element);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyFolderSync(srcAssets, destAssets);
const distIndex = path.join(destDir, 'index.html');
if (fs.existsSync(distIndex)) {
  const ts = new Date().toISOString();
  fs.appendFileSync(distIndex, `\n<!-- Build TS: ${ts} -->\n`);
}

console.log('Static assets folder copied to dist/');
