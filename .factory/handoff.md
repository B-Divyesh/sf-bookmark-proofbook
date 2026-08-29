# Bookmark Proofbook — polish 3 handoff

## Outcome

Released repair commit: `05d8eccc234146b95e5f6016525ff301daed4f09`.
It is pushed to `main` and deployed through the Static Web Apps work order to
<https://bookmark-proofbook.sociobot.in>.

All findings in `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md` are repaired. The full finding-to-evidence mapping is
in `.factory/polish-3.md`.

## What changed

- Reworked the isolated demo so sample bookmarks appear in the first viewport;
  the capture form and archive controls follow the seeded proofbook.
- Added lossless, confirmed, versioned Bookmark Proofbook JSON restore to the
  static site and Chrome extension. It validates input, previews added and
  replaced bookmarks, preserves every field, and keeps all work local.
- Corrected first-screen and boundary wording, consistent bookmark terms, and
  the demo exit action for returning visitors.
- Added route-complete Twitter images and completed the 404 canonical/OG
  metadata.
- Added claim and regression coverage for visible demo data, cross-surface JSON
  restore, truthful demo exit, metadata, and terminology.

## How to run and verify

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run test:extension
npm run build
npm audit --omit=dev
```

Run every exact public claim command in `.factory/claims.json`. The demo is
available at `/?demo=1` or `/demo`; **Reset demo** recreates the sample and
**Open my proofbook** discards only demo data.

## Exact evidence

- Clean detached clone at `05d8ecc`: `npm ci`; all **21/21** claim commands;
  lint; typecheck; Vitest **12/12**; Playwright site **30/30**; installed MV3
  extension **6/6**; build; and production-dependency audit all passed.
- Local factory URL check: `.factory/evidence/polish-3-local/verify/verify.json`
  reports `lang=en`, one h1, one main landmark, no missing alt text, no unnamed
  buttons, and no browser/page errors.
- Live factory URL check: `.factory/evidence/polish-3-live/verify/verify.json`
  has the same clean result. Live Axe across `/`, `/demo`, `/app`, `/privacy`,
  `/terms`, and the designed 404 is zero violations in
  `.factory/evidence/polish-3-live/axe-live.json`.
- Cold live route/demo/import/metadata/404 assertions are in
  `.factory/evidence/polish-3-live/live-check.json`; mobile evidence is
  `landing-mobile.png` and `demo-mobile.png`.
- Live Lighthouse mobile: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; LCP **1,401.871 ms**, TBT **0 ms**, CLS **0**
  (`.factory/evidence/polish-3-live/lighthouse.json`).
- Built initial JavaScript is 22.82 KB raw / 8.16 KB gzip; CSS is 8.43 KB raw /
  2.60 KB gzip. The responsive hero remains below the 300 KB mobile budget.
  The production JavaScript is byte-identical to the local build (SHA-256
  `797ce653d6eb6d11fe08499bf6f5a4b20458fc5da48eced499e469995891670a`).

## Known gaps and next steps

None. Cold offline reload is intentionally not claimed because the static site
does not register a service worker; an already opened proofbook remains usable
when the connection drops, as tested. There is no paid tier or checkout to
advertise until the factory registers a Sociobot license product.
