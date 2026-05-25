# NeutrapH Site

Static GitHub Pages website for NeutrapH.

## Structure

- `index.html` and the other root `.html` files are the public website pages.
- `assets/css/style.css` contains the shared site styles.
- `assets/js/script.js` contains the shared navigation, WhatsApp order, and form helpers.
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
