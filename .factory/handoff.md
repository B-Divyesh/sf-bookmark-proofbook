# Bookmark Proofbook review 1 handoff — FAIL

## Outcome

An adversarial first-read review was completed against
<https://bookmark-proofbook.sociobot.in> on 2026-08-28. No product code was
modified. The full report is in `.factory/review-1.md`.

**FAIL:** Back navigation loses the visitor's scroll position. This is a
blocking route-behaviour regression. The review also records unlisted public
claims, route/404 metadata gaps, no route announcement, and plain-language
copy issues.

## Verification completed

- Fresh 390 px and desktop live first-read checks.
- Live one-click demo, namespace isolation, Reset, exit discard, outgoing
  request log, and Axe smoke test.
- Every exact command from `.factory/claims.json`: 17/17 PASS.
- `npm run lint`, `npm run typecheck`, `npm test` (10/10), `npm run test:e2e`
  (24/24), `npm run test:extension` (4/4), `npm audit --omit=dev`, and
  `npm run build`: PASS.
- Live routes/link crawl, direct 404, metadata, first-Tab focus, history
  behaviour, cache headers, and earlier-verification findings were rechecked.

## Reproduce

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

## Next steps

Address every `F-1-*` finding in `.factory/review-1.md`, especially the
blocking scroll restoration. Add the specified regression tests, then rerun
the full independent review from a fresh context. The tree remains buildable;
only this review and handoff documentation were changed.
