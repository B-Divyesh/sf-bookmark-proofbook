# Bookmark Proofbook independent verification handoff — FAIL

## Outcome

**FAIL** for candidate `79b69c81f9d31a42fe5d47d67b39c6784fd6e2b9`
at <https://bookmark-proofbook.sociobot.in>, verified 2026-08-28 from a clean
checkout. Production is deployed and byte-matches the candidate's JS, CSS,
hero, and unpacked extension. This is not a deployment-only failure.

The mandatory first-read gate passes, the one-click demo exists, all seven
exact `.factory/claims.json` commands pass, and the main extension flow works.
The release fails because public claims remain unlisted in `claims.json`, which
the supplied acceptance contract makes release-blocking.

## Verification summary

- `npm ci`: pass; audit found 10 vulnerable dependencies (3 critical, 4 high).
- `npm test`: pass, 7/7.
- `npx tsc --noEmit`: pass.
- `npm run test:e2e`: pass, 15/15.
- `npm run build`: pass; `dist/site/` and 267,602-byte MV3 zip produced.
- Live Lighthouse mobile: 100 performance / 100 accessibility / 100 best
  practices / 100 SEO; LCP 1.4 s, CLS 0, TBT 60 ms.
- Live and extension axe: zero serious/critical findings; no console/page
  errors; same-origin-only companion-site flow; security and cache headers
  present.
- Downloaded extension: explicit capture, required reason, selected-text
  search, HTML/JSON export, unchanged/changed health states, error recovery,
  and 500-record import all work. A health run issued exactly the documented
  25 requests.

## Release-blocking and high defects

1. Public claims such as the 12,000-character cap, 25-link limit, explicit-only
   active-page read, no analytics, deletion, no paywall bypass, and always-built
   zip are absent from `.factory/claims.json`.
2. The live site offers only a raw extension zip, with no install instructions
   or normal store/signed installation path.
3. Site and extension delete records immediately with no confirmation or undo.
4. **Start for real** leaves the `demo:` namespace stored instead of discarding
   it.
5. Multiple 390 px controls are below 44 by 44 px.

Medium findings: manual entry stores `javascript:` URLs; unknown routes return
200 and all routes use the home canonical; the clean-install toolchain has
critical/high advisories; README lacks deployment and extension-install steps.

## Evidence and next step

The complete evidence, exact claim table, deployment hashes, functional cases,
headers, exclusions, and severity list are in
`.factory/verification-2.md`. Screenshots, Lighthouse JSON, and factory URL
verification output are in `.factory/evidence/`.

No product source was modified. Repair the listed findings, then rerun every
claim command, local gate, clean-profile extension flow, and live checks before
release.
