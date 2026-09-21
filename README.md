# NeutrapH Site

Static GitHub Pages website for NeutrapH.

## Current pre-launch state

Orders, payments and walk-in refills are closed. Public prices are explicitly labelled placeholders, approved for display only. Package commitments, water-test evidence, equipment specifications and operating terms remain pending. See `LAUNCH_READINESS.md` for outstanding owner decisions. Run `node tests/prelaunch.test.cjs` and `node netlify/prepare-build.js` before publishing. Source HTML owns the business copy; build scripts must not rewrite it.

The historical payment setup below is not launch approval. Public pages do not load `payfast.js`. Optional serverless checkout creation rejects requests unless `NEUTRAPH_CHECKOUT_ENABLED=true`; do not set that flag until payment readiness is reviewed and tested.

## Structure

- `index.html` and the other root `.html` files are the public website pages.
- `assets/css/style.css` contains the shared site styles.
- `assets/css/layout.css` contains the former runtime layout rules; `page-*.css` holds page-specific styles and `usability.css` holds responsive/accessibility improvements. Layout is not injected by JavaScript.
- `assets/js/script.js` contains shared navigation, WhatsApp enquiry, and form helpers.
- `templates/header.html` and `templates/footer.html` are the shared navigation/contact sources. After editing them, run `node scripts/sync-shared.cjs` and commit the generated root HTML. Run with `--check` to detect drift.
- `sitemap.xml` lists indexable pages; `robots.txt` points crawlers to it. Keep page titles, descriptions, canonical links and social previews current when adding pages.
- `assets/images/` contains all image assets with lowercase, web-safe filenames.
- `archive/` contains old backup files that are not part of the live site.

Keep `CNAME` in the repository root so the custom domain continues to work on GitHub Pages.

## PayFast setup

- Frontend static checkout lives in `assets/js/payfast.js`. Add the public PayFast Merchant ID and Merchant Key there if you want direct GitHub Pages form posts.
- Keep the PayFast passphrase server-side only. Add these environment variables in Vercel or Netlify:
  - `PAYFAST_MERCHANT_ID`
  - `PAYFAST_MERCHANT_KEY`
  - `PAYFAST_PASSPHRASE`
  - `PAYFAST_MODE` (`sandbox` or `live`)
- The serverless endpoints are:
  - `POST /api/payfast/create-payment`
  - `POST /api/payfast/itn`
- The PayFast notify URL is configured as `https://www.neutraph.co.za/payment-notify`.

See `PAYFAST_SETUP.md` for the full setup notes.
