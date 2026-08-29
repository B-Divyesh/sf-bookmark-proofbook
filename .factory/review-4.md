# Adversarial first-read review 4 — FAIL

**Product:** Bookmark Proofbook
**Reviewed:** 2026-08-29
**Live URL:** <https://bookmark-proofbook.sociobot.in>
**Candidate:** `200f0c429fb1b1ca6431ade6ec7b083eb391cd46`

## Verdict

**FAIL.** The product is clear, the demo is real and isolated, every declared claim passes from a clean clone, and earlier findings remain fixed. One minor mobile first-screen requirement is still unmet: two of the three promised plain facts are below the fold. PASS requires zero findings.

## Cold first read

Fresh Chromium contexts opened the live root at 390 × 844 and 1440 × 900, without scrolling or activating anything.

| Question | Answer in my own words | Exact first-screen evidence |
| --- | --- | --- |
| What does it do? | It keeps why a saved link mattered so I can find it later. | “Save why each link mattered” |
| Who is it for? | People who have more bookmarks than they can remember. | “For people with too many bookmarks to remember, save context and find the resource again.” |
| What should I click first? | Open the ready-made sample proofbook. | “Try it with sample data” and “Opens a sample proofbook with three bookmarks.” |

At 390 px, the primary action is fully visible at y=668–715. At desktop it is at y=448–495. The landing made only same-origin document, CSS, JavaScript, and self-hosted-image requests, with no console or page errors. This gate passes.

## Findings

### Minor

#### F-4-1 — Two required first-screen facts are below the mobile fold

**Location/quote:** live landing at 390 × 844, directly below **Try it with sample data**. Only “No account required.” begins at y=803 and is clipped at the fold. “Capture, search, and export work locally.” and “Export a readable HTML proofbook.” are below y=844.

**Why this is a finding:** The first-screen contract requires three plain privacy/offline/price facts beside the first action. A phone visitor sees the job and action, but not the local-storage and export facts which explain why trying this tool is safe and useful. The page remains understandable, so this does not meet the explicit first-read blocking condition; it is nevertheless an incomplete mobile first screen.

**Concrete fix:** Reduce the mobile hero artwork/vertical gap enough to show all three existing facts, or move them immediately below the action and crop the decorative artwork on narrow screens. Add a 390 × 844 regression requiring all three fact list items to intersect the initial viewport.

## Copy audit

Counts are whitespace-delimited. All reader-facing landing and README sentences, headings, labels, and actions are listed below. No item exceeds 22 words; none uses banned marketing language, unexplained product jargon, a metaphor/mood heading, or a non-result-naming action. F-4-1 is placement, not wording.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| LOCAL BOOKMARK TOOL | 3 | Clear category label |
| Save why each link mattered | 5 | Clear verb-first headline |
| For people with too many bookmarks to remember, save context and find the resource again. | 15 | Clear audience and result |
| Try it with sample data | 5 | Result-naming action |
| Opens a sample proofbook with three bookmarks. | 7 | Explains the action |
| No account required. | 3 | Listed claim; placement in F-4-1 |
| Capture, search, and export work locally. | 6 | Listed claim; placement in F-4-1 |
| Export a readable HTML proofbook. | 5 | Listed claim; placement in F-4-1 |
| Install the browser extension | 4 | Clear action |
| BOOKMARK DETAILS | 2 | Clear section label |
| What each bookmark keeps | 4 | Clear section heading |
| Each bookmark stores your reason, selected words, and a small page extract. | 12 | Listed claim |
| It also stores a code that identifies that extract. | 9 | Listed claim |
| Checked once | 2 | Sample status |
| Appropriate Uses For SQLite | 4 | Sample title |
| Why I saved it: Decide when a small local database is the sensible choice. | 14 | Concrete sample reason |
| SQLite is not directly comparable to client/server SQL database engines. | 10 | Sample quotation |
| extract code · 4fa1c0e7 | 4 | Explained product term |
| THREE STEPS | 2 | Clear section label |
| How Bookmark Proofbook works | 4 | Clear section heading |
| Capture a link. | 3 | Action step |
| Write why it matters while you still know. | 8 | Useful instruction |
| Search your words. | 3 | Action step |
| Find a source by the reason or extract you saved. | 10 | Listed claim |
| Export your proofbook. | 3 | Action step |
| Export a readable HTML proofbook. | 5 | Listed claim |
| Saved extract limit | 3 | Clear boundary heading |
| It stores a text extract of up to 12,000 characters. | 10 | Listed claim |
| CHROME OR EDGE | 3 | Clear platform label |
| Install the browser extension | 4 | Clear section heading |
| Download the extension zip | 4 | Result-naming action |
| Extract the zip to a folder you can keep. | 9 | Useful instruction |
| Open chrome://extensions or edge://extensions and turn on Developer mode. | 9 | Useful instruction |
| Choose Load unpacked, then select the extracted folder. | 8 | Useful instruction |
| Keep the folder after installation. | 5 | Useful instruction |
| Bookmark Proofbook keeps the reason beside the link. | 8 | Product-specific footer line |
| Built by Param Factory · v1.0.1 | 6 | Attribution and version |

Navigation labels (**Demo**, **My proofbook**, **Privacy**, **Terms**), the wordmark, and **Skip to main content** are controls/labels rather than prose sentences. They are clear in context.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Bookmark Proofbook | 2 | Product heading |
| Save why each link mattered. | 5 | Clear product job |
| Bookmark Proofbook is for people with too many bookmarks to remember. | 11 | Clear audience |
| It keeps a reason, selected words, and a small page extract beside each link. | 14 | Listed claim |
| It also stores a code that identifies that extract. | 9 | Listed claim |
| Search that context later and export a readable HTML or JSON proofbook. | 12 | Listed claims |
| Restore a JSON proofbook without losing its bookmark fields. | 10 | Listed claim |
| The Chrome extension captures pages. | 5 | Clear role |
| It reads the active page only after you press Capture this page. | 12 | Listed claim |
| The companion site has an isolated sample at `/?demo=1` and your proofbook at `/app`. | 14 | Listed demo claim |
| Run | 1 | Clear heading |
| Open the printed local URL. | 5 | Useful instruction |
| Use `/demo` for isolated sample data. | 6 | Listed demo claim |
| Install the extension | 3 | Clear heading |
| Run `npm run build`, or download the extension zip from the product site. Then: | 14 | Useful instruction |
| Extract the zip to a folder you can keep. | 9 | Useful instruction |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Useful instruction |
| Turn on Developer mode. | 4 | Useful instruction |
| Choose Load unpacked and select the extracted folder. | 7 | Useful instruction |
| The generated zip is `dist/site/downloads/bookmark-proofbook-extension.zip`. | 5 | Listed package claim |
| Test | 1 | Clear heading |
| The extension tests use a clean Chromium profile. | 8 | Developer fact |
| The exact public claim commands are listed in `.factory/claims.json`. | 9 | Developer fact |
| The demo contract is in `.factory/demo.md`. | 6 | Developer fact |
| Deploy | 1 | Clear heading |
| `npm run build` creates the static deployment in `dist/site`, including the Chrome extension zip. | 14 | Listed package claim |
| Deploy that directory with the factory's static Azure Static Web Apps work order. | 13 | Developer instruction |
| Do not deploy `.output` or the repository root. | 8 | Useful scope instruction |
| The repository does not manage DNS, billing, or cloud infrastructure. | 10 | Clear scope statement |
| Privacy and limits | 3 | Clear heading |
| No account is required for capture, search, or export. | 9 | Listed claim |
| The companion site stores bookmarks in browser local storage and does not send them to a service. | 17 | Listed claims |
| The companion site does not run analytics. | 7 | Listed claim |
| The extension stores bookmarks in extension local storage. | 9 | Listed claim |
| Each saved page extract is capped at 12,000 characters. | 9 | Listed claim |
| The extension contacts saved addresses only after you press Check links. | 11 | Listed claim |
| Each check processes at most 25 bookmarks. | 7 | Listed claim |
| Remove has an immediate undo action in both the site and extension. | 12 | Listed claim |
| An opened proofbook keeps working if the connection drops. | 9 | Listed claim |
| License | 1 | Clear heading |
| MIT. See [LICENSE](LICENSE). | 3 | Clear license statement |

Terminology is consistent: **bookmark** is the saved item, **proofbook** is the collection, **extract** is saved page text, and **extract code** is its identifier. No live landing or README claim-like sentence lacked a matching entry in `.factory/claims.json`.

## Demo, privacy, and claims

- One activation opened `/?demo=1`. At 390 × 844, the initial demo contained its banner, **Saved bookmarks (3)**, and a realistic SQLite bookmark starting at y=468.
- The persistent banner read “Demo — sample data, nothing is saved.” It offered **Reset demo** and **Open my proofbook**. Reset restored all three samples. A pre-seeded real bookmark remained untouched; exit removed only `demo:bookmark-proofbook:records` and retained `proofbook:records`.
- In an already loaded offline demo, `keyboard` search returned the WCAG bookmark and **Export HTML** produced `bookmark-proofbook.html`.
- The landing/demo/reset/exit flow made only same-origin requests. It made no analytics, record-sync, font-CDN, or API request.
- A fresh clone ran `npm ci` and every exact command in `.factory/claims.json`: `save-bookmark-context`, `search-saved-context`, `portable-export`, `lossless-json-import`, `demo-namespace`, `one-click-demo`, `no-account-required`, `local-records`, `offline-session`, `no-record-sync`, `no-analytics`, `explicit-page-read`, `extension-local-records`, `extract-cap`, `link-check-limit`, `packaged-extension`, `unpacked-install`, `reversible-delete`, `http-links-only`, `browser-html-import`, and `evidence-hash` all passed (21/21).
- That clone also passed lint, typecheck, Vitest (12/12), site Playwright (30/30), extension Playwright (6/6), build, and production-dependency audit. It produced `dist/site`; initial JS was 22.82 kB raw / 8.16 kB gzip. The live JS and CSS SHA-256 values matched the fresh build.

## Earlier-finding regression check

I read `review-1.md`, `review-2.md`, `review-3.md`, all three polish maps, the prior handoff, and all three earlier verification reports. Each earlier finding was checked against live behaviour and current source rather than accepted from a status note.

| Earlier finding(s) | Current confirmation |
| --- | --- |
| F-1-1 | Navigation from y=1100 to Demo then Back restored y=1100; focus returned to the h1 and the polite announcer named the route. |
| F-1-2, F-1-3 | The unproved full-page and browser-store statements remain absent. |
| F-1-4, F-1-5 | `extension-local-records` and `one-click-demo` are declared and passed; the landing action opens the isolated populated demo. |
| F-1-6, F-1-7, F-3-3 | All public routes and the real HTTP 404 have route-specific title, description, canonical, OG/Twitter data, local icon, and absolute Twitter image. |
| F-1-8 | The atomic polite route announcer and h1 focus behaviour remain present. |
| F-1-9 through F-1-14 | Clear headings, no decorative caption, plain **extract code**, **Open my proofbook**, and plain README extension wording remain live. |
| F-2-1, F-3-7 | The landing, demo, app, README, and source consistently use **bookmark** for the item and **proofbook** for the collection. The prior “saved evidence”, “workspace”, and “saved notes” terms are absent. |
| F-3-1 | The initial mobile demo visibly contains a complete sample bookmark at y=468, without scrolling. |
| F-3-2 | The unproved self-contained/open-anywhere wording is absent; export copy uses the declared readable HTML proofbook claim. |
| F-3-4 | Site and extension expose versioned **Import proofbook JSON**; its declared cross-surface lossless-import test passed. |
| F-3-5, F-3-6 | The exit is **Open my proofbook**, and the limit section is **Saved extract limit**. |

No earlier finding is reopened.

## Structure and missed leverage

- All public routes returned 200; the unknown address returned the designed HTTP 404. All rendered internal links, the extension download, and the three sample-source links returned 200.
- Routes have `lang=en`, one h1, one main landmark, skip link, header/footer, route titles, descriptions, canonical/OG/Twitter data, favicon, and apple-touch icon. Back restores scroll; route changes move focus and announce the destination. The 390 px layout has no horizontal overflow.
- The test suite verifies zero Axe violations on the mobile demo and no serious/critical violations on landing, app, legal pages, and 404. CSP is a response header, including `frame-ancestors`.
- The concrete, paper, moss, heavy-rule, monospace archive surface and original artwork follow `.factory/design.md` and are not a generic SaaS template. The brief does not imply a worthwhile AI step; local capture, search, lossless import, export, and link checks already cover the obvious leverage. No decorative AI feature or embedded provider key was found.

## What would make this perfect

Repair F-4-1 and add the stated 390 × 844 first-screen regression. Then the existing clear first read, real isolated demo, claims coverage, route handling, privacy behaviour, and visual system would leave no finding.
