# Bookmark Proofbook — polish 4 handoff

## Released repair

Repair commit `e69e96a79eb6f1281f81273f9aff3733ce6a85bf` is pushed to `main`
and deployed through the Static Web Apps work order to
<https://bookmark-proofbook.sociobot.in>. Deployment
`55839741-8999-46d7-9a7e-cf2ce8bc39f8` succeeded.

The only review-4 defect was F-4-1: two mobile hero facts fell below the
390 × 844 fold. On small screens the text now precedes the decorative artwork,
the hero has less vertical space, and the test requires all three facts to be
fully visible. The catalog description is now the verb-first, 77-character
sentence: “Save context for every bookmark, then search and export your local
proofbook.”

`.factory/polish-4.md` maps every finding from reviews 1–4 to its implemented
repair and current evidence. No earlier finding was reopened.

## Verification

- Fresh clone: `/tmp/bookmark-proofbook-polish-4-clean.9KMQex` ran `npm ci`,
  all 21 exact `claims.json` commands (all passed), lint, typecheck, Vitest
  **12/12**, site Playwright **31/31**, extension Playwright **6/6**, build,
  and `npm audit --omit=dev` (zero vulnerabilities). Claim logs are in
  `/tmp/bookmark-proofbook-polish-4-claims.IxEIPQ` for this work order.
- Local URL verifier: `.factory/evidence/polish-4-local/verify/verify.json`
  records a title, `lang=en`, one h1, main landmark, no missing image alt or
  unnamed buttons, and no console/page errors. The 390 × 844 landing and demo
  screenshots are `landing-mobile-first-screen.png` and
  `demo-mobile-first-screen.png` in that directory.
- Cold production URL verifier: `.factory/evidence/polish-4-live/verify/verify.json`
  passed with the same semantic and console checks. Live mobile screenshots are
  `.factory/evidence/polish-4-live/landing-mobile-first-screen.png` and
  `.factory/evidence/polish-4-live/demo-mobile-first-screen.png`.
- Cold live browser recheck: `.factory/evidence/polish-4-live/live-check.json`
  confirms `/`, `?demo=1`, `/demo`, `/app`, `/privacy`, and `/terms` return
  200 with route-specific metadata; the unknown route returns a designed 404;
  all have zero serious/critical Axe findings and no external requests. It also
  records all three mobile fact bottoms (547.28, 615.88, 659.67) within the
  844 px viewport, the isolated three-bookmark demo with a sample at y=466.41,
  and Back restoration from y=1100.
- Build: `dist/site` was produced. Initial JavaScript is 22.82 kB raw / 8.16
  kB gzip and CSS is 8.49 kB raw / 2.59 kB gzip. Production serves byte-identical
  `index-C5aoMG9d.js` with SHA-256
  `797ce653d6eb6d11fe08499bf6f5a4b20458fc5da48eced499e469995891670a`.

## Run and deploy

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

Run every exact command in `.factory/claims.json` after a clean `npm ci`.
Deploy `dist/site` with the factory Static Web Apps work order. The demo is
`/?demo=1` or `/demo`; **Reset demo** recreates the sample and **Open my
proofbook** discards only demo storage.

## Known gaps and next steps

None. Cold offline reload is intentionally not claimed; the tested promise is
that an already-open proofbook continues working after connection loss. There
is no paid tier or checkout to advertise until the factory registers a
Sociobot license product.
