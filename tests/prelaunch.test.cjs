const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(n => n.endsWith('.html'));
const siteScript = fs.readFileSync(path.join(root, 'assets/js/script.js'), 'utf8');

function runSiteScript(context, after = '') {
  return vm.runInNewContext(siteScript + '\n' + after, {
    location: { pathname: '/contact.html', search: '' },
    URLSearchParams,
    ...context,
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      ...context.document
    }
  });
}

test('Every public page is explicitly pre-launch without checkout or unsupported claims', () => {
  for (const name of pages) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    assert.match(html, /class="launch-notice"/, name);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, name);
    assert.doesNotMatch(html, /Most Popular|Best Seller|Health Regulation Approved|Today we serve|First schools and churches onboarded|src="assets\/js\/payfast.js"/, name);
  }
});

test('Displayed prices match the agreed placeholders and each carries a qualification', () => {
  const expected = {
    'index.html': ['249', '399', '549'],
    'subscriptions.html': ['249', '399', '549'],
    'Shop.html': ['49.99', '99.99', '39.99', '59.99', '119.99'],
    'water-dispensers.html': ['1,999.99', '2,499.99', '2,999.99'],
    'refilling-station.html': ['2.50']
  };
  for (const [page, prices] of Object.entries(expected)) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.deepEqual([...html.matchAll(/\bR([\d,.]+)/g)].map(m => m[1]), prices, page);
    assert.equal((html.match(/Placeholder price · subject to change before launch/g) || []).length, prices.length, page);
  }
  const launch = fs.readFileSync(path.join(root, 'launch-information.html'), 'utf8');
  assert.match(launch, /Water-test evidence is pending/);
  assert.match(launch, /Equipment specifications are not yet available/);
  assert.match(launch, /Operating terms are not yet available/);
});

test('Local linked resources and IDs exist, including responsive images', () => {
  for (const name of pages) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, 'Duplicate ID in ' + name);
    for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?(?:#([^"]+))?"/g)) {
      if (/^(?:https?:|mailto:|tel:|data:)/.test(m[1])) continue;
      const target = path.join(root, m[1]);
      assert.ok(fs.existsSync(target), name + ': ' + m[1]);
      if (m[2]) assert.match(fs.readFileSync(target, 'utf8'), new RegExp('id="' + m[2] + '"'));
    }
    for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(m[1]), name + ': #' + m[1]);
    for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const source of m[1].split(',')) assert.ok(fs.existsSync(path.join(root, source.trim().split(' ')[0])));
  }
});

test('Contact retains labelled, minimal enquiry fields; Home has no duplicate form', () => {
  const forms = ['contact.html'].map(name => fs.readFileSync(path.join(root, name), 'utf8').match(/<form\b[\s\S]*?<\/form>/)[0]);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /home-contact|<form\b/);
  assert.doesNotMatch(forms[0], /name="Address"|Delivery Frequency/);
  for (const m of forms[0].matchAll(/<(?:input|select|textarea)\b[^>]*id="([^"]+)"/g)) assert.ok(forms[0].includes('for="' + m[1] + '"'));
  assert.match(forms[0], /privacy.html/);
  assert.match(forms[0], /<input\b[^>]*name="email"[^>]*required/);
  assert.equal((forms[0].match(/<button\b/g) || []).length, 1);
  assert.match(forms[0], /type="submit"[^>]*>Send<\/button>/);
});

test('Payment pages cannot claim success or cancellation and are not indexable', () => {
  for (const name of ['payment-success.html', 'payment-cancelled.html']) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    assert.match(html, /Online payments are not available/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html, /Your PayFast payment was completed successfully|No payment was taken/);
  }
});

test('Product hand-off preserves quantity, recipient and enquiry-only wording', () => {
  let opened;
  runSiteScript({
    document: { getElementById: id => id === 'qty-189LWaterDispenserBottle' ? { value: '3' } : null },
    window: { open: url => { opened = new URL(url); } }
  }, 'orderProduct("18.9L Water Dispenser Bottle");');
  assert.equal(opened.origin, 'https://wa.me');
  assert.equal(opened.pathname, '/27798134597');
  assert.match(opened.searchParams.get('text'), /quantity: 3/);
  assert.match(opened.searchParams.get('text'), /enquiry, not an order/);
});

test('Plan and service selection handles all supported values and rejects unknown values', () => {
  const html = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
  const options = Array.from(html.matchAll(/<option value="([^"]+)">/g), ([, value]) => ({ value }));
  const supported = ['starter', 'standard', 'business', 'general', 'packaged', 'dispenser', 'refill', 'purification'];
  for (const [query, expected] of [...supported.map(value => ['service=' + value, value]), ['plan=starter', 'starter'], ['plan=unknown', ''], ['', '']]) {
    const interest = { value: '', options };
    const form = { elements: { namedItem: () => interest }, querySelector: () => ({}), getAttribute: () => null, addEventListener() {} };
    runSiteScript({ document: { getElementById: () => form }, location: { pathname: '/contact.html', search: query } });
    assert.equal(interest.value, expected, query);
  }
});

test('The enquiry form confirms accepted submissions and keeps details after failed attempts', async () => {
  const html = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
  assert.match(html, /<section[^>]*id="enquiry-success"[^>]*\bhidden>/);
  assert.match(html, /A NeutrapH representative will get back to you within 24 hours\./);
  const formUrl = 'https://formspree.io/f/testform';
  for (const [endpoint, reply, expectedState] of [
    [formUrl, { next: '/thanks' }, 'success'],
    [formUrl, { error: 'Form unavailable' }, 'error'],
    [null, null, 'error']
  ]) {
    const button = { disabled: true, textContent: 'Send' };
    const status = { textContent: '' };
    const entry = { hidden: false };
    let focused = false;
    const confirmation = { hidden: true, focus: () => { focused = true; } };
    const interest = { options: [], selectedOptions: [{ textContent: 'Business plan' }] };
    let submit;
    let reset = false;
    let requests = 0;
    const form = {
      elements: { namedItem: () => interest },
      querySelector: selector => selector.startsWith('button') ? button : status,
      getAttribute: () => endpoint,
      addEventListener: (_, listener) => { submit = listener; },
      reset: () => { reset = true; }
    };
    runSiteScript({
      document: {
        getElementById: id => ({
          'enquiry-form': form,
          'enquiry-entry': entry,
          'enquiry-success': confirmation
        })[id]
      },
      FormData: class extends Map {
        constructor() {
          super([['email', 'visitor@example.com']]);
        }
      },
      async fetch(url, request) {
        requests += 1;
        assert.equal(url, formUrl);
        assert.equal(request.method, 'POST');
        assert.equal(request.body.get('email'), 'visitor@example.com');
        assert.equal(request.body.get('Interest'), 'Business plan');
        return { ok: true, json: async () => reply };
      }
    });
    const event = { preventDefault() {} };
    await Promise.all([submit(event), submit(event)]);
    assert.equal(requests, endpoint ? 1 : 0);
    const accepted = expectedState === 'success';
    assert.equal(reset, accepted);
    assert.equal(entry.hidden, accepted);
    assert.equal(confirmation.hidden, !accepted);
    assert.equal(focused, accepted);
    assert.equal(button.disabled, accepted);
    if (!accepted) {
      assert.equal(button.textContent, 'Send');
      assert.match(status.textContent, /unavailable|couldn’t confirm/);
    }
  }
});

test('Optional backend checkout is disabled by default before launch', () => {
  const previous = process.env.NEUTRAPH_CHECKOUT_ENABLED;
  delete process.env.NEUTRAPH_CHECKOUT_ENABLED;
  try {
    const { createPayment } = require('../api/payfast/_shared');
    assert.throws(() => createPayment({ productId: 'subscription-starter' }), error => error.statusCode === 503);
  } finally {
    if (previous !== undefined) process.env.NEUTRAPH_CHECKOUT_ENABLED = previous;
  }
});
