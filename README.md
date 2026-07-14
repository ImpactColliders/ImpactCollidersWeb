# The ARCHIVE — homepage (plain HTML / CSS / JS)

This is a pure, framework-free version of the homepage: no React, no build
step, no npm install. Open `index.html` in a browser and it just works.

## Files

```
index.html    All the page markup (mobile + desktop layouts, switched via CSS media query)
styles.css    Every style, as real CSS rules — no Tailwind, no utility classes
script.js     Empty placeholder for future interactivity
images/       All 17 photos/logos used on the page, with descriptive filenames
```

## How it works

- **Responsive layout, no JS required.** The page contains two top-level
  sections, `.mobile-view-wrapper` and `.desktop-view-wrapper`. CSS media
  queries (`@media (min-width: 768px)`) show one and hide the other — the
  same breakpoint the original design used.
- **Class names** are based on the original Figma layer names (e.g.
  `.header`, `.navigation-tab`, `.sign-up-button`, `.about-photo`) so you can
  find the CSS for a given piece of the page by looking at its `class` in
  `index.html`.
- **Animations** (the two slowly-spinning shapes behind the hero text, and
  the scrolling logo marquee near the bottom) are plain CSS `@keyframes`,
  defined near the top of `styles.css`.
- **Fonts** (Hammersmith One, Italiana, Itim, Jersey 25, La Belle Aurore,
  Poppins) load from Google Fonts via the `@import` at the top of
  `styles.css`.

## Editing

Everything is hand-editable:

- Change text directly in `index.html`.
- Change colors, spacing, sizes, fonts in `styles.css` — search for the
  class name you want (e.g. `.about-photo` or `.header`).
- Swap an image by replacing the file in `images/` (keep the same filename,
  or update the `src="images/..."` reference in `index.html`).

## Notes

- The original design has no working interactivity yet (the mobile menu
  icon, for instance, doesn't open anything) — that part was true of the
  Figma Make export too, so nothing was lost in translation. `script.js` is
  there for you to add that behavior when you're ready.
- One photo (`about-photo`) was a 3071×4096px, 6.5MB original — it's been
  resized/compressed to a normal web size (~180KB) since it only ever
  displays at 439×315px on the page. Everything else is untouched from the
  original export.
