# Save bookmark context — independent review 6 — FAIL

**Product:** Bookmark Proofbook  
**Reviewed:** 2026-09-06  
**Live URL:** <https://bookmark-proofbook.sociobot.in>  
**Implementation candidate:** `e69e96a79eb6f1281f81273f9aff3733ce6a85bf`  
**Documentation commit reviewed:** `d9ffbb74ed44caeb9398e95a80c8ba0855174c92`

## Verdict

**FAIL.** This review found **4 findings** and **2 untested public claims**.
The live product performs its main job, its sample is isolated, all 21 declared
claim commands pass, and all earlier findings remain repaired. It does not meet
the zero-finding acceptance rule because the demo label does not stay visible,
the first screen omits the required offline and price facts, and two public
extension capabilities are not fully covered by the claim registry.

No product code was changed during this review.

## First screen before scrolling

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900.

| Question | Answer in plain words | Live evidence |
| --- | --- | --- |
| What is the job? | Save why a bookmarked link mattered so it can be found later. | “Save why each link mattered” |
| Who is it for? | People with too many bookmarks to remember. | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I do first? | Open the ready-made sample proofbook. | “Try it with sample data” and “Opens a sample proofbook with three bookmarks.” |

The primary action was visible at y=380–427 on the phone and y=448–495 on
desktop. All three current fact lines were visible by y=660 on the phone. The
fresh landing made four same-origin requests and had no console or page error.

## Findings

### High

#### F-6-1 — Link-check results have no complete declared claim test

**Location:** Installed extension, **Check links**; status results “Reachable
when checked,” “Page changed,” and “Could not reach page”; `.factory/claims.json`
entry `link-check-limit`.

**Evidence:** The declared test proves that no address is contacted before the
button is pressed, 25 requests are made, and the 26th bookmark stays unchecked.
It never asserts that the first 25 bookmarks receive correct reachable,
changed, or unreachable states, or that a check time is saved. The claim's own
sandbox description says to inspect stored health states, but the test only
checks the untouched 26th state.

An extra clean-profile review test confirmed that the current implementation
can mark one fixture `changed` and another `unreachable`. That manual result
does not replace the required declared regression for this core public
capability.

**Fix:** Add a declared `link-health-results` claim and tagged installed-
extension test. Use deterministic reachable, changed, and unreachable fixtures;
assert each saved state and `checkedAt`. Keep the existing explicit-action and
25-link limit claim.

**Untested public claim count:** +1.

### Medium

#### F-6-2 — The demo label is not persistent while using lower controls

**Location:** Live `/?demo=1` and `/demo`.

**Evidence:** The banner initially says “Demo — sample data, nothing is saved”
and has the required reset and exit actions. After scrolling to the add/import
area, its computed position is `static`; its box was y=-2191 to -2059 and was
not visible. A visitor can edit, import, or export without the sample-data label
remaining on screen.

The sandbox itself is sound: adding a demo bookmark changed only
`demo:bookmark-proofbook:records`; reset restored the three samples; exit
deleted the demo key and preserved a pre-seeded real bookmark byte-for-byte.

**Fix:** Keep a compact demo label and its reset/exit controls visible while
the demo page scrolls. Add a 390 × 844 regression that scrolls to the final
form control and asserts that the label still intersects the viewport.

#### F-6-3 — The installed extension makes an inaccurate, untested export claim

**Location:** The live zip's `manifest.json` description.

**Exact text:** “Keep the reason, evidence, and a durable export with each
bookmark.”

**Evidence:** A bookmark stores context, not an export. The product creates an
export only when the user asks for one. “Durable” is also stronger than the
declared `portable-export` claim, whose test checks readable HTML and JSON but
does not prove long-term durability. This installed, user-visible text is not
included in `.factory/copy-audit.md`.

**Fix:** Replace it with tested wording, such as “Save why a bookmark mattered,
search its context, and export your proofbook.” Add manifest text to the copy
audit. If “durable” remains, declare and test the exact stronger promise.

**Untested public claim count:** +1.

### Minor

#### F-6-4 — The first-screen facts omit offline use and price

**Location:** Live landing first screen.

**Observed facts:** “No account required,” “Capture, search, and export work
locally,” and “Export a readable HTML proofbook.”

**Why this is a finding:** All three lines fit on a 390 × 844 screen, so the
earlier placement defect remains fixed. The plain-words contract requires the
three facts to cover privacy, offline use, and price. The page has no explicit
offline or price fact. “Works locally” does not tell a visitor that the opened
proofbook keeps working after the connection drops, and “No account required”
does not state the price.

**Fix:** Use three short, truthful lines for local privacy, the existing
opened-session offline limit, and the actual price. If the current release is
free, say that directly. If a paid release is intended, state the exact price
only after its billing path exists and has a claim test.

## Sample, data safety, and recovery

- One activation from the landing opened `/?demo=1` with three realistic
  SQLite, WCAG, and browser-rendering bookmarks. The first sample began at
  y=467 on the phone without scrolling.
- The sample label, **Reset demo**, and **Open my proofbook** were present.
  F-6-2 records the missing persistent-on-scroll behavior.
- A demo bookmark containing a reason, selected words, and extract increased
  the sample count from three to four. It did not change the real storage key.
- Reset restored exactly three samples. Exit removed the demo namespace and
  preserved the real control bookmark.
- Search showed a clear no-results state and recovered when the query changed.
  Remove and undo restored the selected bookmark.
- A `javascript:` address was rejected, focus returned to the URL input, and
  no bookmark was added. Invalid JSON produced a specific error. A 12,500-
  character entry was capped and stored at 12,000 characters.
- Corrupt JSON already in the real local-storage key was removed on reload and
  the empty proofbook recovered without a console error.
- After the loaded demo went offline, search and HTML export still worked.
  The product does not promise an offline reload or install a service worker.

## Declared claims

`npm ci` completed in a fresh clone. Every exact command in
`.factory/claims.json` passed. Logs are in
`/tmp/bookmark-proofbook-review-6-claims/` for this work order.

| Claim | Exact declared command | Result |
| --- | --- | --- |
| `save-bookmark-context` | `npm run test:e2e -- --grep @claim:save-bookmark-context` | PASS |
| `search-saved-context` | `npm run test:e2e -- --grep @claim:search-saved-context` | PASS |
| `portable-export` | `npm run test:e2e -- --grep @claim:portable-export` | PASS |
| `lossless-json-import` | `npm run test:extension -- --grep @claim:lossless-json-import` | PASS |
| `demo-namespace` | `npm run test:e2e -- --grep @claim:demo-namespace` | PASS |
| `one-click-demo` | `npm run test:e2e -- --grep @claim:one-click-demo` | PASS |
| `no-account-required` | `npm run test:e2e -- --grep @claim:no-account-required` | PASS |
| `local-records` | `npm run test:e2e -- --grep @claim:local-records` | PASS |
| `offline-session` | `npm run test:e2e -- --grep @claim:offline-session` | PASS |
| `no-record-sync` | `npm run test:e2e -- --grep @claim:no-record-sync` | PASS |
| `no-analytics` | `npm run test:e2e -- --grep @claim:no-analytics` | PASS |
| `explicit-page-read` | `npm run test:extension -- --grep @claim:explicit-page-read` | PASS |
| `extension-local-records` | `npm run test:extension -- --grep @claim:extension-local-records` | PASS |
| `extract-cap` | `npm test -- --testNamePattern @claim:extract-cap` | PASS |
| `link-check-limit` | `npm run test:extension -- --grep @claim:link-check-limit` | PASS, incomplete per F-6-1 |
| `packaged-extension` | `npm run test:e2e -- --grep @claim:packaged-extension` | PASS |
| `unpacked-install` | `npm run test:extension -- --grep @claim:unpacked-install` | PASS |
| `reversible-delete` | `npm run test:e2e -- --grep @claim:reversible-delete` | PASS |
| `http-links-only` | `npm run test:e2e -- --grep @claim:http-links-only` | PASS |
| `browser-html-import` | `npm run test:e2e -- --grep @claim:browser-html-import` | PASS |
| `evidence-hash` | `npm test -- --testNamePattern @claim:evidence-hash` | PASS |

F-6-1 and F-6-3 explain the two public claims that are not fully tested by
this registry.

## Earlier findings

I read reviews 1–5, polish reports 1–4, all verification reports, and the prior
handoff. No earlier exact defect reopened.

| Earlier finding | Current evidence |
| --- | --- |
| F-1-1 | A live navigation from scroll y=1100 and Back restored y=1100; focus and the polite announcement returned to the landing heading. |
| F-1-2 | The unproved full-page-storage clause remains absent; the 12,000-character limit passed. |
| F-1-3 | The browser-store absence statement remains absent. |
| F-1-4 | `extension-local-records` is declared and passed in a clean installed extension. |
| F-1-5 | One click opened the isolated three-bookmark sample. |
| F-1-6 | Every live route updated title, description, canonical, Open Graph, and Twitter metadata. |
| F-1-7 | The unknown route returned a designed HTTP 404 with `noindex`, icons, canonical, share data, and a home action. |
| F-1-8 | Route changes focused the h1 and updated the atomic polite announcer. |
| F-1-9 | The heading remains “How Bookmark Proofbook works.” |
| F-1-10 | The heading remains “What each bookmark keeps.” |
| F-1-11 | The decorative caption remains absent; the useful image alt remains. |
| F-1-12 | Site copy explains “extract code”; “evidence hash” remains absent from reader copy. |
| F-1-13 | The demo exit remains “Open my proofbook.” |
| F-1-14 | The README remains free of MV3 and Xvfb reader jargon. |
| F-2-1 | Site, app, and README use **bookmark** for the item and **proofbook** for the collection. F-6-3 concerns separate installed-manifest wording. |
| F-3-1 | The first mobile demo viewport contains the sample count and the first realistic bookmark beginning at y=467. |
| F-3-2 | “Self-contained” and “open anywhere” remain absent. F-6-3 is a new stronger claim in the manifest. |
| F-3-3 | Every route and the 404 use the absolute local Twitter image. |
| F-3-4 | Site and extension expose confirmed, versioned, lossless JSON restore; its claim passed. |
| F-3-5 | Demo exit preserved a pre-existing real bookmark and discarded only demo data. |
| F-3-6 | The section remains “Saved extract limit.” |
| F-3-7 | The landing and sample use “bookmark,” not “saved notes.” |
| F-4-1 | All three existing fact lines are fully visible on 390 × 844; F-6-4 concerns their required content, not placement. |

## Accessibility, routes, links, privacy, and performance

- Live `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. The
  designed unknown route correctly returned HTTP 404; that response is not a
  defect. It has one h1, one main, the product header/footer, and a home link.
- All routes have `lang=en`, one h1, one main, ordered headings, route titles,
  metadata, local icons, and a skip link. Keyboard focus starts on the skip
  link with a 4 px visible outline; Enter moves focus to `main`. Sample controls
  use native controls and measured about 44 px or more.
- Playwright Axe found zero violations on all public routes and the 404.
  Reduced-motion emulation reduced transitions to 0.01 ms. The standalone Axe
  CLI was also attempted but its Selenium Chrome session could not start in
  this container; the repository's Playwright Axe integration and the separate
  live Playwright Axe run both completed.
- The live privacy and terms routes work. Capture, search, demo reset, export,
  and exit made no third-party request. No analytics or external font/script
  ran. The privacy address is present. No privacy request was sent.
- All product-owned links and downloads returned 200. SQLite and web.dev sample
  links returned 200. W3C returned its browser automation challenge (403) to
  Chromium but returned the requested document (200) to a plain HTTP client;
  this is not a dead-link finding.
- The response sends CSP, HSTS, nosniff, and referrer-policy headers. CSP sends
  `frame-ancestors` as a response header, not a meta element.
- Lighthouse mobile scored 100 for Performance, Accessibility, Best Practices,
  and SEO. LCP was 1,424 ms, CLS 0, TBT 0 ms, and transferred bytes were
  127,854. Built JavaScript was 22.82 kB raw / 8.16 kB gzip; CSS was 8.49 kB
  raw / 2.59 kB gzip.
- The concrete, paper, moss, heavy-rule, monospaced design and original local
  artwork match `.factory/design.md`. No third-party font or runtime AI feature
  is present. The brief does not need an AI step.
- This is a static site and browser extension. Backend tenant isolation,
  server restart persistence, health endpoints, and 429/`Retry-After` checks
  do not apply.

## Clean quality gates

From the clean clone at documentation commit `d9ffbb7`:

| Command | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm test` | PASS — 12 tests |
| `npm run test:e2e` | PASS — 31 tests |
| `npm run test:extension` | PASS — 6 tests in clean installed profiles |
| `npm run build` | PASS — produced `dist/site` and the extension zip |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `/opt/fleet/lib/verify-url.sh` | PASS — no console errors and required structure present |

The live JavaScript, CSS, and extension zip SHA-256 values exactly match the
clean build. There are no product-code commits after implementation
`e69e96a`; commits `37c42f3` and `d9ffbb7` contain only review evidence and
documentation.

## Required next work

Fix F-6-1 through F-6-4, add the stated regressions and claims, then rerun every
declared claim command and full quality gate from a clean checkout. PASS still
requires zero findings and zero untested claims.
