# Bookmark Proofbook repair handoff — PASS

## Outcome

Repaired every release-blocking, high, and medium finding in independent report
`8c1a12b637e489cb3539193bffd9378a6b1e4729` for candidate
`79b69c81f9d31a42fe5d47d67b39c6784fd6e2b9`. The product remains a Chrome
MV3 browser extension with a static companion site.

Repair commit: `fa961b9bb3f204b74d284b9e0583d4d9ad1f496b`.

Production was deployed to the existing Azure Static Web App
`sf-bookmark-proofbook` and verified at
<https://bookmark-proofbook.sociobot.in> on 2026-08-28.

## Findings repaired

- Expanded `.factory/claims.json` from 7 to 17 public claims. Every ID occurs
  in exactly one `@claim:<id>` regression, and every listed command passed
  individually from a clean install.
- Added on-page and README instructions for downloading, extracting, and
  loading the MV3 artifact in Chrome or Edge. A clean-profile suite loads and
  uses the generated extension.
- Made record removal reversible in both the companion site and extension with
  an announced **Undo remove** action.
- **Start for real** now discards `demo:bookmark-proofbook:records` before the
  isolated real workspace opens. **Reset demo** restores the three samples.
- Raised demo actions, record links, remove controls, footer links, extension
  controls, and related interactive targets to at least 44 by 44 CSS pixels.
- Added shared HTTP(S)-only URL validation. Manual `javascript:` and FTP
  addresses cannot be stored; browser HTML import keeps only unique HTTP(S)
  links.
- Replaced SPA fallback routing with physical route entry points and Azure
  rewrites for `/demo`, `/app`, `/privacy`, and `/terms`. Each route has its
  own canonical. Unknown routes now return an actual styled HTTP 404.
- Upgraded WXT to 0.21.4, pinned Playwright 1.58.2, added ESLint, and reduced
  `npm audit --omit=dev` from 10 advisories to zero.
- Made packaging select the exact package-version zip and fail if it is absent,
  preventing a stale zip from being copied when older WXT outputs exist.
- Added deployment and unpacked-extension instructions to `README.md`.

## Regression and release verification

Run from `/work/repo`:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run test:extension
npm audit --omit=dev
npm run build
```

Results after the clean install:

- `npm ci`: 256 packages installed; zero audit findings.
- ESLint: pass. TypeScript `--noEmit`: pass.
- Vitest: 10/10 pass.
- Playwright site/browser: 24/24 pass on Chromium, including desktop, 390 px,
  keyboard focus, reduced motion, 44 px targets, HTTP(S) validation, demo
  teardown, undo, privacy requests, offline opened-session behavior, route
  canonicals, true 404, and axe on every route.
- Installed-extension Playwright: 4/4 pass in clean Chromium profiles,
  including explicit capture, extension-local storage, 26-record/25-request
  link checking, extension undo, and axe with no serious/critical findings.
- All 17 exact `.factory/claims.json` commands: pass individually.
- Production build: pass. Initial JS 17,395 bytes raw / 6,759 gzip; CSS 7,661
  raw / 2,425 gzip; hero WebP 115,156 bytes; MV3 zip 268,642 bytes.
- Factory URL verifier on live: title, `lang`, one h1, main, alt text, labels,
  and console/page errors all pass. Evidence is under
  `.factory/evidence/repair-verify-live/`.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.4 s, CLS 0, TBT 0 ms, 123 KiB transferred. Evidence:
  `.factory/evidence/lighthouse-repair-live.json`.
- Live desktop, 390 px landing, and 390 px demo screenshots are in
  `.factory/evidence/repair-live-*.png`. All had no console errors, no
  horizontal overflow, and same-origin-only requests.

## Deployment and identity evidence

- `/`, `/demo`, `/app`, `/privacy`, and `/terms`: HTTP 200.
- Unknown route: HTTP 404 with the designed recovery page.
- Extension download: HTTP 200 `application/zip`; cache is 10-minute
  revalidation. Hashed assets are immutable for one year.
- Live and local JS SHA-256:
  `0273a913c6ac747aca247d6d7ced214dc6f9069cab002b22d1832a7e0a474065`.
- Live and local CSS SHA-256:
  `8e05b6398887e6e52999988eafb47e307d1564b9e99f4b6923157f3e86924d0a`.
- Live and local extension zip SHA-256:
  `c18d03ea2198f7203fe41cdd100b9d0fa3f8c53a09b2ab2dd5156a5fa07327b4`.
- Live security headers include HSTS, CSP, `nosniff`, and strict-origin
  referrer policy. `/privacy` publishes its route-specific canonical.

## Known gaps

- This release uses documented unpacked installation because no Chrome Web
  Store or Edge Add-ons listing exists. The shipped artifact itself is fully
  installable and tested.
- The Sociobot checkout remains unregistered (HTTP 404), so the site continues
  to avoid advertising or linking a dead paid tier. Invalid-license verify is
  healthy (HTTP 200). Register the product before adding a paid unlock.
- The opened workspace works after a connection drop. A cold offline reload is
  intentionally not claimed because this browser-extension product does not
  install a site service worker.

No release-blocking product-QA gaps remain from the independent report.
