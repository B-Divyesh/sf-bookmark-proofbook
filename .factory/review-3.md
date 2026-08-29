# Adversarial first-read review 3 — FAIL

**Product:** Bookmark Proofbook

**Reviewed:** 2026-08-29

**Live URL:** <https://bookmark-proofbook.sociobot.in>

**Candidate:** `9463231156105fb1164a1da4bbb97ad09f7ae6b3`

## Verdict

**FAIL.** The landing page is clear, the demo is isolated, all 20 declared
claim commands pass from a clean clone, and all earlier findings remain fixed.
The demo nevertheless fails its main first-screen requirement: neither the
390 px nor desktop viewport shows any sample bookmark after the one-click
entry. There are six additional findings. A PASS requires zero findings.

## Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900.
Nothing was scrolled or activated before recording the first screen.

| Question | Answer in my own words | Exact first-screen evidence |
| --- | --- | --- |
| What does it do? | It saves why a bookmarked link was useful so I can find it again. | “Save why each link mattered” |
| Who is it for? | People who save too many bookmarks to remember their purpose. | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I click first? | Open the populated sample. | “Try it with sample data” |

The mobile action starts at y=668 and is visible before the 844 px fold. The
desktop action starts at y=448. The initial page made four same-origin
requests and produced no console or page errors. This gate passes.

## Findings

### Blocking

#### F-3-1 — The demo’s first screen does not show the sample data

**Location/quote:** live `/?demo=1` and `/demo`, immediately after activating
“Try it with sample data.” The first screen shows the banner, “Find a saved
reason,” export controls, and the beginning of “Add a bookmark.”

**Observed:** At 390 × 844, the first sample bookmark begins at y=1640. At
1440 × 900, it begins at y=1242. No realistic title, saved reason, quotation,
extract, status, or bookmark count is visible in either initial viewport. A
visitor must scroll through the complete add form before seeing the sample.

**Why this fails:** The required one-click demo must immediately look like the
product being used with realistic sample data. A label saying “SAMPLE
PROOFBOOK” does not demonstrate the product. This is a blocking demo failure.

**Concrete fix:** Put the search control, “Saved bookmarks (3),” and at least
one complete sample bookmark directly below the demo heading. Move “Add a
bookmark” below the populated list or collapse it behind an **Add a bookmark**
button. Add a 390 × 844 test that enters from the landing action and asserts a
sample bookmark intersects the viewport without scrolling.

### High

#### F-3-2 — “Open anywhere” is a public claim without a matching claim or test

**Location/quote:** landing, **How Bookmark Proofbook works**: “Keep a
self-contained file you can open anywhere.”

**Why this fails:** `.factory/claims.json` promises a “readable HTML or JSON
proofbook.” Its `portable-export` test checks the download contents and absence
of a script, but it does not open the exported HTML offline or prove that it
has no external dependencies. “Self-contained” and “open anywhere” are
stronger promises than the listed claim.

**Concrete fix:** Either rewrite the sentence to the tested “Export a readable
HTML proofbook,” or add a `self-contained-export` claim whose test downloads
the file, opens it in an offline browser context, records requests, and checks
that the sample bookmarks remain readable with no external resource load.

### Medium

#### F-3-3 — The large Twitter card declares no image

**Location:** the `<head>` on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and
the designed 404.

**Observed:** Every route has `twitter:card=summary_large_image`, title, and
description, but none has a `twitter:image` element. The 1200 × 630 original
`/social-preview.webp` exists and is already used by Open Graph.

**Why this fails:** A shared route declares a large-image Twitter card without
naming the image. This does not meet the required Twitter-card metadata set
and can produce a text-only or inconsistent preview.

**Concrete fix:** Add
`<meta name="twitter:image" content="https://bookmark-proofbook.sociobot.in/social-preview.webp">`
to every pre-rendered route and the 404. Extend the route metadata test to
assert the absolute image URL and a 200 response.

#### F-3-4 — Export has no lossless restore path

**Location/quote:** live proofbook and extension controls: “Export JSON,”
“Export HTML,” and “Import browser HTML.”

**Why this fails:** The product exports its own JSON backup but cannot import
that format. Importing the exported HTML as browser bookmarks retains only URL
and title; it discards the reason, selected words, extract, extract code,
timestamps, and status. The site and extension also use separate local stores,
so a captured proofbook cannot be moved between them without losing the core
context. A lossless restore/import is the obvious missing value implied by a
local-first export.

**Concrete fix:** Add **Import proofbook JSON** to the site and extension.
Validate format/version and URLs, preview the number added or replaced,
deduplicate safely, and preserve every bookmark field. Add a claim test that
exports the sample, clears storage, imports it into the other surface, and
compares all fields while recording no external requests.

#### F-3-5 — The demo exit can falsely call an existing proofbook empty

**Location/quote:** demo banner action: “Open my empty proofbook.”

**Observed:** With a real bookmark pre-seeded in `proofbook:records`, the demo
kept that record untouched, removed only the `demo:` key on exit, and opened
`/app` with one record. The action still said the destination was empty.

**Why this fails:** The isolation is correct, but the result-naming action is
false for a returning visitor. It creates doubt about whether real data was
preserved.

**Concrete fix:** Rename it **Open my proofbook**. Keep the existing isolation
test and add a case with pre-existing real data that checks the label and the
preserved record after exit.

### Minor

#### F-3-6 — The boundary heading contradicts its content

**Location/quote:** landing heading “What it does not do,” followed only by
“It stores a text extract of up to 12,000 characters.”

**Why this fails:** The sentence says what the product does, so the heading
does not name the section heard or read out of context.

**Concrete fix:** Rename the heading **Saved extract limit**. If a real
non-feature boundary is added later, list it separately and add any claim it
creates.

#### F-3-7 — The landing calls sample bookmarks “notes”

**Location/quote:** first-screen action explanation: “Opens a sample proofbook
with three saved notes.” The destination calls them “Saved bookmarks (3).”

**Why this fails:** The previous terminology repair established **bookmark**
for a saved item and **proofbook** for the collection. “Notes” adds another
name at the exact handoff between landing and demo.

**Concrete fix:** Rewrite as “Opens a sample proofbook with three bookmarks,”
and extend the existing copy regression to reject “saved notes” as an item
name.

## Copy audit

Counts are whitespace-delimited. The tables include sentences, headings,
labels, and actions so that the required heading and button checks are visible.
No item exceeds 22 words and no banned marketing adjective appears.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| LOCAL BOOKMARK TOOL | 3 | Pass; concrete category label |
| Save why each link mattered | 5 | Pass; verb-first job headline |
| For people with too many bookmarks to remember, save context and find the resource again. | 15 | Pass; audience and outcome |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens a sample proofbook with three saved notes. | 8 | **F-3-7** inconsistent item name |
| No account required. | 3 | Listed claim |
| Capture, search, and export work locally. | 6 | Listed claim |
| Export a readable HTML proofbook. | 5 | Listed claim |
| Install the browser extension | 4 | Pass; result-naming link |
| BOOKMARK DETAILS | 2 | Pass; section label |
| What each bookmark keeps | 4 | Pass; section heading |
| Each bookmark stores your reason, selected words, and a small page extract. | 12 | Listed claim |
| It also stores a code that identifies that extract. | 9 | Listed claim |
| Checked once | 2 | Sample status |
| Appropriate Uses For SQLite | 4 | Sample title |
| Why I saved it: Decide when a small local database is the sensible choice. | 14 | Sample reason |
| SQLite is not directly comparable to client/server SQL database engines. | 10 | Sample quotation |
| extract code · 4fa1c0e7 | 4 | Explained product label |
| THREE STEPS | 2 | Pass; section label |
| How Bookmark Proofbook works | 4 | Pass; section heading |
| Capture a link. | 3 | Pass |
| Write why it matters while you still know. | 8 | Pass |
| Search your words. | 3 | Pass |
| Find a source by the reason or extract you saved. | 10 | Listed claim |
| Export your proofbook. | 3 | Pass |
| Keep a self-contained file you can open anywhere. | 8 | **F-3-2** unlisted stronger claim |
| What it does not do | 5 | **F-3-6** heading does not name its content |
| It stores a text extract of up to 12,000 characters. | 10 | Listed claim |
| CHROME OR EDGE | 3 | Pass; platform label |
| Install the browser extension | 4 | Pass; section heading |
| Download the extension zip | 4 | Pass; result-naming action |
| Extract the zip to a folder you can keep. | 9 | Pass |
| Open chrome://extensions or edge://extensions and turn on Developer mode. | 9 | Pass |
| Choose Load unpacked, then select the extracted folder. | 8 | Pass |
| Keep the folder after installation. | 5 | Pass |
| Bookmark Proofbook keeps the reason beside the link. | 8 | Listed product summary |

Navigation labels “Demo,” “My proofbook,” “Privacy,” and “Terms,” the wordmark,
and the version attribution are not sentences. Each is clear in context.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Bookmark Proofbook | 2 | Product heading |
| Save why each link mattered. | 5 | Pass |
| Bookmark Proofbook is for people with too many bookmarks to remember. | 11 | Pass |
| It keeps a reason, selected words, and a small page extract beside each link. | 14 | Listed claim |
| It also stores a code that identifies that extract. | 9 | Listed claim |
| Search that context later and export a readable HTML or JSON proofbook. | 12 | Listed claims |
| The Chrome extension captures pages. | 5 | Listed claim |
| It reads the active page only after you press Capture this page. | 12 | Listed claim |
| The companion site has an isolated sample at `/?demo=1` and an empty proofbook at `/app`. | 15 | Listed claims |
| Run | 1 | Clear heading |
| Open the printed local URL. | 5 | Pass |
| Use `/demo` for isolated sample data. | 6 | Listed claim |
| Install the extension | 3 | Clear heading |
| Run `npm run build`, or download the extension zip from the product site. | 13 | Pass |
| Then: | 1 | List introduction |
| Extract the zip to a folder you can keep. | 9 | Pass |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| Turn on **Developer mode**. | 4 | Pass |
| Choose **Load unpacked** and select the extracted folder. | 8 | Pass |
| The generated zip is `dist/site/downloads/bookmark-proofbook-extension.zip`. | 5 | Listed claim |
| Test | 1 | Clear heading |
| The extension tests use a clean Chromium profile. | 8 | Developer fact |
| The exact public claim commands are listed in `.factory/claims.json`. | 9 | Developer fact |
| The demo contract is in `.factory/demo.md`. | 6 | Developer fact |
| Deploy | 1 | Clear heading |
| `npm run build` creates the static deployment in `dist/site`, including the Chrome extension zip. | 14 | Listed build/package claim |
| Deploy that directory with the factory's static Azure Static Web Apps work order. | 13 | Developer instruction |
| Do not deploy `.output` or the repository root. | 8 | Developer instruction |
| The repository does not manage DNS, billing, or cloud infrastructure. | 10 | Scope statement |
| Privacy and limits | 3 | Clear heading |
| No account is required for capture, search, or export. | 9 | Listed claim |
| The companion site stores bookmarks in browser local storage and does not send them to a service. | 17 | Listed claims |
| The companion site does not run analytics. | 7 | Listed claim |
| The extension stores bookmarks in extension local storage. | 9 | Listed claim |
| Each saved page extract is capped at 12,000 characters. | 9 | Listed claim |
| The extension contacts saved addresses only after you press **Check links**. | 11 | Listed claim |
| Each check processes at most 25 bookmarks. | 7 | Listed claim |
| Remove has an immediate undo action in both the site and extension. | 12 | Listed claim |
| An opened proofbook keeps working if the connection drops. | 9 | Listed claim |
| License | 1 | Clear heading |
| MIT. | 1 | License statement |
| See [LICENSE](LICENSE). | 2 | Pass |

The README has no over-22-word sentence, banned marketing adjective, unclear
heading, metaphor, slogan, inconsistent public term, or non-result-naming
button. The landing flags are F-3-2, F-3-6, and F-3-7.

## Demo, sandbox, and privacy

- One landing activation opens `/?demo=1`; the banner is present with **Reset
  demo** and the exit action. The three realistic SQLite, WCAG, and browser
  bookmarks are loaded, but F-3-1 records why their placement fails the
  first-screen requirement.
- Removing one sample changed the count from three to two. **Reset demo**
  restored three.
- A sentinel real bookmark remained unchanged throughout the demo. Demo state
  used only `demo:bookmark-proofbook:records`; exit removed that key and kept
  `proofbook:records` intact.
- With the context offline after initial load, search found the WCAG sample and
  HTML export downloaded successfully.
- The complete live landing/demo/reset/offline/exit flow requested only the
  product origin. There were no analytics, API, font-CDN, record-sync, console,
  or page-error events.

## Declared claims

A separate clean clone was created at the reviewed commit, followed by
`npm ci`. Every exact command from `.factory/claims.json` passed.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `save-bookmark-context` | `npm run test:e2e -- --grep @claim:save-bookmark-context` | PASS, 1 test |
| `search-saved-context` | `npm run test:e2e -- --grep @claim:search-saved-context` | PASS, 1 test |
| `portable-export` | `npm run test:e2e -- --grep @claim:portable-export` | PASS, 1 test |
| `demo-namespace` | `npm run test:e2e -- --grep @claim:demo-namespace` | PASS, 1 test |
| `one-click-demo` | `npm run test:e2e -- --grep @claim:one-click-demo` | PASS, 1 test |
| `no-account-required` | `npm run test:e2e -- --grep @claim:no-account-required` | PASS, 1 test |
| `local-records` | `npm run test:e2e -- --grep @claim:local-records` | PASS, 1 test |
| `offline-session` | `npm run test:e2e -- --grep @claim:offline-session` | PASS, 1 test |
| `no-record-sync` | `npm run test:e2e -- --grep @claim:no-record-sync` | PASS, 1 test |
| `no-analytics` | `npm run test:e2e -- --grep @claim:no-analytics` | PASS, 1 test |
| `explicit-page-read` | `npm run test:extension -- --grep @claim:explicit-page-read` | PASS, 1 test |
| `extension-local-records` | `npm run test:extension -- --grep @claim:extension-local-records` | PASS, 1 test |
| `extract-cap` | `npm test -- --testNamePattern @claim:extract-cap` | PASS, 1 test |
| `link-check-limit` | `npm run test:extension -- --grep @claim:link-check-limit` | PASS, 1 test |
| `packaged-extension` | `npm run test:e2e -- --grep @claim:packaged-extension` | PASS, 1 test |
| `unpacked-install` | `npm run test:extension -- --grep @claim:unpacked-install` | PASS, 1 test |
| `reversible-delete` | `npm run test:e2e -- --grep @claim:reversible-delete` | PASS, 1 test |
| `http-links-only` | `npm run test:e2e -- --grep @claim:http-links-only` | PASS, 1 test |
| `browser-html-import` | `npm run test:e2e -- --grep @claim:browser-html-import` | PASS, 1 test |
| `evidence-hash` | `npm test -- --testNamePattern @claim:evidence-hash` | PASS, 1 test |

No declared test failed. F-3-2 is the one public sentence that exceeds the
scope of its nearest listed claim; it remains untested.

## Earlier-finding regression check

`review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the prior
handoff were read in full. Each earlier finding was checked on production and
in current source rather than accepted from the repair notes.

| Earlier id | Current result |
| --- | --- |
| F-1-1 | Fixed: footer navigation then Back restored `scrollY=2472`; focus moved to the h1 and the polite announcer updated. |
| F-1-2 | Fixed: the unlisted “not a full web page” clause remains absent. |
| F-1-3 | Fixed: the browser-store absence claim remains absent. |
| F-1-4 | Fixed: `extension-local-records` is listed and its clean-profile test passed. |
| F-1-5 | Fixed as tested: the landing action reaches the three-bookmark isolated demo in one activation. F-3-1 is a new presentation failure. |
| F-1-6 | Fixed: title, description, canonical, OG title/description/URL, and Twitter title/description update per route. F-3-3 concerns the still-missing Twitter image. |
| F-1-7 | Fixed: direct unknown paths return a designed HTTP 404 with `noindex`, local icons, share copy, and a return-home action. |
| F-1-8 | Fixed: route changes focus the h1 and update the atomic polite announcer. |
| F-1-9 | Fixed: “How Bookmark Proofbook works” remains in production. |
| F-1-10 | Fixed: “What each bookmark keeps” remains in production. |
| F-1-11 | Fixed: the decorative artwork caption remains absent and useful alt text remains. |
| F-1-12 | Fixed: reader copy uses and explains “extract code”; “evidence hash” is not exposed. |
| F-1-13 | Fixed against its original wording: “Start for real” remains absent and the action names a destination. F-3-5 records its newly exposed false empty-state assumption. |
| F-1-14 | Fixed: README reader copy does not use MV3 or Xvfb jargon. |
| F-2-1 | Fixed for the terms it identified: “record,” “saved evidence,” and “workspace” remain absent from reader copy. F-3-7 identifies the separate surviving “saved notes” inconsistency. |

No earlier ID is reopened as blocking because its stated defect and repair
criterion remain fixed.

## Structure, accessibility, and quality checks

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. An unknown route
  returns the designed 404. All crawled internal links, the extension zip, and
  the three external sample sources return 200.
- Every route has `lang=en`, one h1, one main, the consistent header/footer,
  skip link, description, canonical policy, Open Graph image, favicon, and
  180 px apple-touch icon. F-3-3 is the Twitter-image exception.
- The sitemap lists all five public routes. Response headers include HSTS,
  nosniff, referrer policy, and CSP with `frame-ancestors` delivered as a
  header.
- Route changes update title, focus the new h1, announce it, and preserve
  scroll on Back. The 390 px pages have no horizontal overflow.
- Live Axe produced zero violations on all five routes and the 404. The factory
  URL verifier passed the landing page with no console errors, one h1,
  `lang=en`, a main landmark, and complete image alt attributes.
- `npm run lint`, `npm run typecheck`, `npm test` (11/11), `npm run test:e2e`
  (28/28), `npm run test:extension` (5/5), and `npm run build` pass. The built
  initial JavaScript is 19.25 KB raw / 7.08 KB gzip.
- The concrete-and-moss archive layout, square rules, monospaced labels,
  original artwork, and restrained stamp motion are distinct and match
  `.factory/design.md`. Reduced motion is covered. It is not a generic SaaS
  template.

## Missed leverage

No AI feature is warranted by the brief; classification or summarisation would
add disclosure, cost, and network use without improving the core capture job.
No provider key or decorative AI flow is present. F-3-4 is the concrete missed
leverage: a local-first product that exports its own structured backup needs a
lossless restore/import path before sync should be considered.

## What would make this perfect

Show a real sample bookmark in the first demo viewport; make the HTML export
promise exactly match its test; add the Twitter image tag; add lossless JSON
restore across site and extension; rename the demo exit and the boundary
heading; and call the samples bookmarks rather than notes. Add the specified
regressions and rerun all claim commands and the full suite from a clean clone.
