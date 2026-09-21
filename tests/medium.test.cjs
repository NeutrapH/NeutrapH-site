const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(p => p.endsWith('.html'));
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('All pages have unique search descriptions and matching production canonicals/social URLs', () => {
  const descriptions = [];
  const sitemap = read('sitemap.xml');
  for (const page of pages) {
    const html = read(page);
    const url = 'https://neutraph.co.za/' + (page === 'index.html' ? '' : page);
    descriptions.push(html.match(/<meta name="description" content="([^"]+)"/)[1]);
    assert.ok(html.includes('<link rel="canonical" href="' + url + '">'), page);
    assert.ok(html.includes('<meta property="og:url" content="' + url + '">'), page);
    assert.equal(sitemap.includes('<loc>' + url + '</loc>'), !page.startsWith('payment-'), page);
    assert.match(html, /href="#main-content"/);
    assert.match(html, /<main id="main-content" tabindex="-1">/);
  }
  assert.equal(new Set(descriptions).size, pages.length);
  assert.ok(fs.statSync(path.join(root,'assets/images/social-preview.jpg')).size > 1000);
});

test('Shared navigation/contact information stays consistent across every page', () => {
  execFileSync(process.execPath, ['scripts/sync-shared.cjs', '--check'], {cwd:root});
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /href="tel:\+27798134597"/);
    assert.match(html, /href="mailto:info@neutraph.co.za"/);
    if (read('templates/header.html').includes('data-page="'+page+'"')) {
      assert.ok(html.includes('data-page="'+page+'" class="active" aria-current="page"'));
    }
  }
});

test('Extracted CSS image/import paths resolve from the stylesheet directory', () => {
  for (const name of fs.readdirSync(path.join(root,'assets/css'))) {
    const file = path.join(root,'assets/css',name);
    for (const match of fs.readFileSync(file,'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (/^(https?:|data:)/.test(match[1])) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file),match[1])),name+': '+match[1]);
    }
  }
});

test('Product quantities support larger enquiries and details work without JavaScript', () => {
  const shop = read('Shop.html');
  const quantities = [...shop.matchAll(/<select\b[^]*?<\/select>/g)];
  assert.equal(quantities.length,5);
  for (const [select] of quantities) assert.match(select, /<option(?: value="20")?>20<\/option>/);
  assert.match(shop, /<details class="product-details"/);
  assert.match(shop, /contact.html\?service=packaged/);
  assert.match(read('water-purification.html'), /<details id="ro-process-section"/);
  assert.match(read('about.html'), /<h2>Themba Mkhabela<\/h2>/);
});
