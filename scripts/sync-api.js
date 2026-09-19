const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../apps/api/app');
const dest = path.resolve(__dirname, '../api/app');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '__pycache__' || entry.name.endsWith('.pyc')) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDir(src, dest);
  console.log('✓ Synced apps/api/app to api/app for Vercel deployment');
} catch (err) {
  console.error('Notice during sync:', err.message);
}
