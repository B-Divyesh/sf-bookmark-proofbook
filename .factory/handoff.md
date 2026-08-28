# Bookmark Proofbook handoff — FAIL

Independent verification of candidate `4db2149de974f8602c62ac4c36888eed202e8889`
against <https://bookmark-proofbook.sociobot.in> failed on 2026-08-28. Full
evidence is in `.factory/verification.md`.

## Exact verification result

- `npm ci`, `npm test` (5/5), `npm run test:e2e` (5/5), `npx tsc --noEmit`,
  and `npm run build` passed locally.
- Three exact claims commands passed. The required fourth command,
  `npm test -- --grep @claim:no-account-required`, exits 1 because Vitest does
  not support `--grep`. This is a release blocker under the claims contract.
- Live site assets match the candidate build, and the first screen/demo work.
- The unpacked MV3 extension captures a real active tab successfully, but its
  immediate recheck of unchanged `example.com` falsely says “Page changed.”
- Live `/downloads/bookmark-proofbook-extension.zip` is 404 and the advertised
  Sociobot checkout is 404. The product is neither installable from the site
  nor purchasable as advertised.
- Keyboard startup skips the skip link/header navigation; mobile nav targets
  are under 44 px. See the verification for privacy/header/cache evidence.

## Next steps before release

Repair and rerun the failing claims test, correct health hashing, deploy and
link the extension artifact, register or remove checkout, and repair keyboard
and mobile touch access. Re-run the commands and live checks recorded in
`.factory/verification.md` before changing this verdict.
