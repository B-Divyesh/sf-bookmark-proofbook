# Bookmark Proofbook design thesis

## Direction: brutalist concrete and moss

Bookmark Proofbook treats saved links as physical evidence, not a stream. The
interface borrows from an archive box left in a damp workshop: blunt rules,
paper labels, charcoal ink, and a small, living moss-green signal for material
that still matters. The contrast between durable concrete and growing moss
matches the product promise: keep context while the web changes around it.

## Tokens

| Role | Value | Use |
| --- | --- | --- |
| concrete | `#E6E3DA` | main light background |
| limewash | `#F7F4EB` | paper surfaces |
| ink | `#1B211C` | body text and rules |
| soot | `#3B443B` | muted text |
| moss | `#295B3B` | primary actions and live states |
| lichen | `#B8CA8B` | restrained highlights |
| rust | `#A7462C` | changed or failed links |
| night | `#182019` | dark workspace background |

The site has a deliberate light archive surface and an optional dark workspace
treatment. Both keep ink/ground contrast above 4.5:1.

## Type and layout

Display headings use the self-hosted system fallback `Arial Black, Impact,
sans-serif`: compressed, printed, and direct. Reading and controls use
`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` to feel like notes
made beside a source. This avoids third-party font loading. The 8px rhythm is
used throughout. Edges are square or only slightly softened (2px); thick 2px
rules make groups feel like labeled evidence slips instead of SaaS cards.

## Interaction and motion

The signature motion is a short 180ms "stamp" on saved records: it settles
down by 2px and becomes opaque. It explains that a note has entered the
archive. Link health has static text and icons, never color alone. Under
`prefers-reduced-motion`, transitions are removed and the stamp appears
instantly.

## Artwork prompt sheet

Subject: a physical archive box of bookmarked research slips and a web page
fragment, with a living tuft of moss growing through a hairline crack.
World/materials: cast concrete, uncoated cream paper, dark graphite ink,
pressed moss, utility labels. Light: soft overcast studio side light. Lens:
top-down editorial still life. Palette words: limewash, charcoal, deep moss,
muted lichen, restrained oxide rust. Negative list: no text, no watermark, no
logos, no people, no brands, no UI screenshot, no gradients.

Asset provenance: `assets/src/proofbook-hero.png` was generated with the
factory image deployment on 2026-08-28 from the prompt above. It is original
product artwork. Optimized WebP is shipped as `public/proofbook-hero.webp`.

