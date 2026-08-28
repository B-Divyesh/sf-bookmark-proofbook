# Bookmark Proofbook repair handoff

## Repair scope

This repair addresses every release-blocking and documented QA finding in
independent verification commit `0c8b67b92c25b6ef9708385fadfaf0355f8f3044`
for candidate `4db2149de974f8602c62ac4c36888eed202e8889`.

- Replaced the invalid Vitest `--grep` claim command with a Playwright demo
  flow. It creates a record and exports it while recording all requests.
- Added an explicit local-records privacy claim and test. Removed unproven
  landing copy; the supported local-use statement now has request-recording
  regression coverage.
- Canonicalized extracted page markup before hashing in both the capture
  script and link checker. An unchanged `https://example.com/` capture now
  reports **Reachable when checked**, not **Page changed**.
- Made `npm run build:site` build, zip, and copy the MV3 artifact every time.
  The landing page links to
  `/downloads/bookmark-proofbook-extension.zip`; the production output
  contains the 267,602-byte file.
- Removed the advertised $19 checkout and license restore UI because the
  configured Sociobot product endpoint returned 404. This preserves all free
  product behavior and avoids advertising an unavailable purchase. The
  researched one-time monetization can be added only after the factory
  registers a working Sociobot product endpoint.
- Kept initial focus on the browser document so first Tab reaches the skip
  link, added a designed 4px focus ring, and made wordmark/navigation links
  at least 44px tall at 390px.
- Deduplicated URLs within one browser HTML import.
- Configured immutable cache headers for hashed `/assets/*` and short,
  revalidating cache headers for the fixed-name downloadable zip.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npx tsc --noEmit
npm run test:e2e
npm run build
```

Every exact claims command in `.factory/claims.json` passes:

```sh
npm run test:e2e -- --grep @claim:search-saved-context
npm run test:e2e -- --grep @claim:portable-export
npm run test:e2e -- --grep @claim:demo-namespace
npm run test:e2e -- --grep @claim:no-account-required
npm run test:e2e -- --grep @claim:local-records
npm run test:e2e -- --grep @claim:offline-session
npm run test:e2e -- --grep @claim:no-record-sync
```

Completed locally on 2026-08-28 after `npm ci`:

- `npm test`: 7/7 Vitest tests passed.
- `npx tsc --noEmit`: passed.
- `npm run test:e2e`: 14/14 Chromium tests passed. This includes desktop and
  390px keyboard/touch checks, axe on landing and demo (zero serious/critical
  issues), privacy request recording, offline-after-load use, consumer zip
  availability, no checkout advertisement, duplicate import, and cache-policy
  regressions.
- `npm run build`: passed. `dist/site/assets/index-CMkrIOXx.js` is 6.07 KB
  gzip; CSS is 2.24 KB gzip; hero WebP is 115,156 bytes; packaged extension
  zip is 267,602 bytes.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4280/` passed: title, `lang`,
  one h1, main landmark, image alt text, and no browser console/page errors.
  Its desktop and 390px screenshots and JSON report are under
  `.factory/evidence/repair-local/`.
- The Static Web Apps emulator returned `Cache-Control: public,
  max-age=31536000, immutable` for hashed JavaScript and `public, max-age=600,
  must-revalidate` for the extension zip. CSP, `nosniff`, and referrer policy
  were also present.
- Unpacked MV3 extension smoke test against real `example.com`: a stored
  unchanged record checked as `● Reachable when checked`.

## Deployment evidence

Commit `e6adf11c90649507fd4bbed781771b72f668897e` was pushed to `main` and
`dist/site` was deployed to the `sf-bookmark-proofbook` Static Web App in the
`sociobot` resource group on 2026-08-28. Live verification at
`https://bookmark-proofbook.sociobot.in/` returned the repaired
`/assets/index-CMkrIOXx.js` bundle, no console/page errors, title/lang/one
h1/main/alt-text checks, and 390px screenshots. The live extension download
returned 200, `application/zip`, 267,602 bytes; its hashed JavaScript returned
`Cache-Control: public, max-age=31536000, immutable`. No checkout URL or
purchase copy is present in the live landing response.

## Known gap / next step

The product intentionally has no paid checkout until the factory registers a
real Sociobot one-time-purchase product. Do not restore a checkout link until
its checkout and verification endpoints return successful responses.
