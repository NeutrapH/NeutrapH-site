// Keep static navigation and contact information available without JavaScript.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const check = process.argv.includes('--check');
for (const page of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
  const file = path.join(root, page);
  const original = fs.readFileSync(file, 'utf8');
  let html = original;
  for (const part of ['header', 'footer']) {
    let shared = fs.readFileSync(path.join(root, 'templates', part + '.html'), 'utf8').trim();
    if (part === 'header') shared = shared.replace('data-page="' + page + '"', 'data-page="' + page + '" class="active" aria-current="page"');
    const pattern = new RegExp('<' + part + '\\b[^]*?</' + part + '>');
    html = pattern.test(html) ? html.replace(pattern, shared) : html.replace('</main>', '</main>\n' + shared);
  }
  if (check && html !== original) throw new Error('Run node scripts/sync-shared.cjs to update ' + page);
  if (!check) fs.writeFileSync(file, html);
}
console.log(check ? 'Shared page components are consistent.' : 'Shared page components updated.');
