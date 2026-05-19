const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const imageMap = new Map(Object.entries({
  '10L Water Bottle.png': 'product-water-10l.png',
  '18.9L Water Dispenser Bottle.png': 'product-water-18-9l-dispenser-bottle.png',
  '5L Water Bottle.png': 'product-water-5l.png',
  '6x1.5L Water Bottles.png': 'product-water-1-5l-6pack.png',
  '6x500ml Water Bottles.png': 'product-water-500ml-6pack.png',
  'Business plan image.png': 'subscription-business.png',
  'Dispenser hero.png': 'hero-dispenser.png',
  'Glass of water Picture.png': 'glass-of-water.png',
  'Index hero.png': 'hero-home.png',
  'NeutrapH Logo.png': 'neutraph-logo.png',
  'NeutrapH Secondary Logo.png': 'neutraph-secondary-logo.png',
  'Neutraph shop.png': 'neutraph-shop.png',
  'Packaged Water.png': 'packaged-water.png',
  'RO Filter Picture.png': 'ro-filter.png',
  'RO Process Diagram.png': 'ro-process-diagram.png',
  'Refilling Station hero.png': 'hero-refilling-station.png',
  'Standard plan image.png': 'subscription-standard.png',
  'Starter plan image.png': 'subscription-starter.png',
  'Subscriptions hero.png': 'hero-subscriptions.png',
  'Water Dispenser Option 1.png': 'water-dispenser-option-1.png',
  'Water Dispenser Option 2.png': 'water-dispenser-option-2.png',
  'Water Dispenser Option 3.png': 'water-dispenser-option-3.png',
  'Water Dispenser Picture.png': 'water-dispenser.png',
  'Water Refilling Station.png': 'water-refilling-station.png',
  'Watershop hero.png': 'hero-shop.png',
  'old NeutrapH logo.png': 'old-neutraph-logo.png'
}));

const htmlPages = [
  'index.html',
  'Our Shop.html',
  'contact.html',
  'water-purification.html',
  'water-dispensers.html',
  'subscriptions.html',
  'refilling-station.html'
];

for (const dir of ['assets/css', 'assets/js', 'assets/images', 'archive']) {
  fs.mkdirSync(dir, { recursive: true });
}

function gitMv(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  execFileSync('git', ['mv', from, to], { stdio: 'inherit' });
}

for (const [oldName, newName] of imageMap) {
  gitMv(oldName, path.join('assets/images', newName));
}

gitMv('style.css', 'assets/css/style.css');
gitMv('script.js', 'assets/js/script.js');
gitMv('index_Backup.html', 'archive/index-backup.html');

function trimAfterHtml(content) {
  const endTag = '</html>';
  const index = content.toLowerCase().indexOf(endTag);
  if (index < 0) return content;
  return content.slice(0, index + endTag.length) + '\n';
}

function updateHtml(content) {
  content = content.replace(/href="style\.css"/g, 'href="assets/css/style.css"');
  content = content.replace(/\s*<link rel="stylesheet" href="water-dispensers-fix\.css">\s*/g, '\n');
  content = content.replace(/src="script\.js"/g, 'src="assets/js/script.js"');
  for (const [oldName, newName] of imageMap) {
    content = content.split(oldName).join(`assets/images/${newName}`);
  }
  return trimAfterHtml(content);
}

for (const page of htmlPages) {
  if (!fs.existsSync(page)) continue;
  fs.writeFileSync(page, updateHtml(fs.readFileSync(page, 'utf8')));
}

const cssPath = 'assets/css/style.css';
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  for (const [oldName, newName] of imageMap) {
    css = css.split(oldName).join(`../images/${newName}`);
  }
  fs.writeFileSync(cssPath, css);
}

fs.writeFileSync('README.md', `# NeutrapH Site

Static GitHub Pages website for NeutrapH.

## Structure

- \`index.html\` and the other root \`.html\` files are the public website pages.
- \`assets/css/style.css\` contains the shared site styles.
- \`assets/js/script.js\` contains the shared navigation, WhatsApp order, and form helpers.
- \`assets/images/\` contains all image assets with lowercase, web-safe filenames.
- \`archive/\` contains old backup files that are not part of the live site.

Keep \`CNAME\` in the repository root so the custom domain continues to work on GitHub Pages.
`);

for (const tempFile of [
  '.github/workflows/codex-reorganize-site.yml',
  '.github/scripts/reorganize-site.js'
]) {
  if (fs.existsSync(tempFile)) {
    execFileSync('git', ['rm', tempFile], { stdio: 'inherit' });
  }
}
