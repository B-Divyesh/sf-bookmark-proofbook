# Demo sandbox

Open `/?demo=1` or `/demo`. The landing-page **Try it with sample data** action
opens `/?demo=1` in one click. The demo creates three realistic research bookmarks:
SQLite guidance, WCAG keyboard guidance, and a browser-rendering explanation.
It stores only in `localStorage` under `demo:bookmark-proofbook:records`.

Use **Reset demo** to discard and recreate the sample. **Open my proofbook**
discards the demo namespace, then opens `/app`. The real proofbook uses the
separate `proofbook:records` key and never reads demo storage.

The demo does not call a network service during normal capture, search, or
export. An opened proofbook works offline after its page has loaded. It does
not claim an offline reload because this static site does not install a service
worker.
