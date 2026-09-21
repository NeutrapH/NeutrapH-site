# Critical and high-priority audit remediation

The site remains a pre-launch enquiry site. Production uses GitHub Pages from `main`; this work is prepared on `fix/prelaunch-critical-high` for review.

## Implemented

- Explicit pre-launch status on all public pages, including payment pages.
- Removed customer history, completed launches, popularity claims, active walk-in availability and unsupported safety/approval claims.
- Retired the archived homepage to prevent obsolete claims being served directly.
- Replaced unapproved prices and package commitments with pending information. Original values remain in Git history; no new prices were invented.
- Unified accessible launch-enquiry forms, correct plan/service preselection, channel-specific contact requirements, honest draft confirmation and copy fallback.
- Added a factual enquiry privacy notice and launch-information page.
- Removed checkout scripts from public pages; payment-result pages no longer claim a transaction outcome and their contact buttons have visible contrast.
- Compressed primary PNG assets to WebP, generated smaller image sources and added lazy loading below the fold.
- Removed obsolete build-time rewriting of founder claims.

## Business decisions and evidence still required before trading

1. Approve prices, tax treatment, delivery/installation charges and the costing of each subscription.
2. Confirm allowance per billing period, equipment rental/ownership, deposits, bottle exchanges, additional refills, minimum term, cancellation and maintenance exclusions.
3. Confirm supplier models, installation requirements, specifications, warranty, bottle materials and compatibility. Clarify whether the 18.9 L offer is empty, filled or an exchange/deposit.
4. Confirm actual treatment equipment and operating status; supply appropriate finished-water test evidence and approval documentation.
5. Confirm station address, opening date, hours, accepted containers, hygiene procedure and tariff, plus delivery areas and support hours.
6. Approve actual sales/returns/cancellation terms and enquiry retention practice before introducing those services. The launch-information page is not a sales contract or a complete future customer privacy policy.
7. Do not enable payment collection using the dormant integration without a separate readiness review, verified payment status, notification handling and transaction tests.

Founder qualifications were retained from existing source copy; the name and founding date still need owner verification. The unverified founding date was removed from public display.

## Validation

Run `node tests/prelaunch.test.cjs` and `node netlify/prepare-build.js`. Browser review covers desktop/mobile rendering, plan/service parameters, field labels, required-field validation, copy fallback, menu expansion and payment-message visibility. No real enquiry or payment needs to be submitted.
