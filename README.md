# Bookmark Proofbook

Keep why each link mattered. Bookmark Proofbook is for people with too many
browser bookmarks to remember. It stores a reason, selected words, a small
page extract, and an evidence hash beside each link. Search those notes later
and export a portable HTML or JSON proofbook.

The browser extension is the main capture tool. It reads the active page only
after you press **Capture this page**. The companion site provides a one-click
demo and a local workspace at `/app`.

## Run

```sh
npm install
npm run dev:site
```

Open the printed local URL, or open `/demo` for the isolated sample. Build the
static site with `npm run build:site`; it writes to `dist/site`. Build both the
site and MV3 extension with `npm run build`. The packaged extension zip is
copied to `dist/site/downloads/` when WXT emits one.

## Test

```sh
npm test
```

The claim tests are listed in `.factory/claims.json`. The demo contract is in
`.factory/demo.md`.

## Privacy and limits

No account is required for capture, search, or export. Records live in browser
or extension local storage. The optional license verification contacts
Sociobot only when a person restores a license. The extension does not bypass
paywalls and saves only a capped text extract (12,000 characters). A link
health check is an explicit action and can check up to 25 links in the free
workspace.

## License

MIT. See [LICENSE](LICENSE). The optional $19 one-time license provides
expanded archive link checks. Sociobot/Dodo is the merchant of record.
