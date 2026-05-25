# PayFast Setup

The website still works as a static GitHub Pages site. PayFast has two supported paths:

1. Static GitHub Pages form submission from `assets/js/payfast.js`.
2. Signed checkout through Vercel or Netlify serverless functions.

## Frontend static setup

Open `assets/js/payfast.js` and replace:

```js
merchantId: 'PAYFAST_MERCHANT_ID_HERE',
merchantKey: 'PAYFAST_MERCHANT_KEY_HERE',
mode: 'sandbox'
```

Use `mode: 'sandbox'` for testing and `mode: 'live'` after PayFast has approved live payments.

Do not put your PayFast passphrase in this frontend file.

## Serverless setup

Deploy this repository to Vercel or Netlify and add these environment variables in the hosting dashboard:

```text
PAYFAST_MERCHANT_ID=your live merchant id
PAYFAST_MERCHANT_KEY=your live merchant key
PAYFAST_PASSPHRASE=your live passphrase
PAYFAST_MODE=sandbox
```

Change `PAYFAST_MODE` to `live` after sandbox testing.

Then open `assets/js/payfast.js` and set `apiBase` to the deployed backend URL, for example:

```js
apiBase: 'https://your-neutraph-payfast-backend.vercel.app'
```

The backend endpoints are:

```text
POST /api/payfast/create-payment
POST /api/payfast/itn
```

The public PayFast notify URL requested for this site is:

```text
https://www.neutraph.co.za/payment-notify
```

If GitHub Pages keeps serving `www.neutraph.co.za`, point `/payment-notify` to the Vercel or Netlify backend with your DNS/proxy setup, or update the PayFast notify URL to the deployed backend URL.
