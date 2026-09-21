// Validate source pages without rewriting business claims at build time.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
for (const file of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
  if (!fs.readFileSync(path.join(root, file), 'utf8').includes('launch-notice')) throw new Error('Missing launch status in ' + file);
}
console.log('Pre-launch pages verified; no content rewritten.');
