# CV site

Static CV for GitHub Pages. All content lives in [`data/cv.json`](data/cv.json); the page is built from it in the browser.
No build step, no dependencies.

## Deploy

1. Put this folder at the root of your repo (e.g. `coderbdsust.github.io` or any repo).
2. GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. Keep `photo.jpg` next to `index.html` (or change `profile.photo` in the JSON). If it is missing, the initials badge is shown.

`.nojekyll` is included so Pages serves the folder as-is.

## Preview locally

The page loads `data/cv.json` with `fetch`, so open it through a server, not by double-clicking:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Update the content (append to the JSON)

Add an object to the matching `items` array. Newest first is the convention for experience.

```jsonc
// Experience / Activities  -> sections[id="experience"].items
{ "role": "Staff Engineer", "start": "2027-01", "end": "present",
  "org": "Acme", "orgUrl": "https://acme.example", "place": "Dhaka, BD",
  "bullets": ["Did a thing.", "Did another thing."] }

// Projects  -> sections[id="projects"].items
{ "name": "New Thing", "url": "https://github.com/you/new-thing", "year": 2027,
  "description": "One sentence.", "stack": ["Java 21", "PostgreSQL"] }

// Certifications / Awards / spoken languages  -> sections[...].items
{ "title": "Some Certificate", "url": "https://…", "meta": "Issuer" }

// A skill  -> sections[id="skills"].groups[n].items   (string, or {"label": "...", "primary": true})
"Rust"
```

Dates are `"YYYY-MM"` or `"YYYY"`; `end` can be `"present"`, or left out for a single point in time (graduation year).
Durations ("1 yr 5 mos") are calculated automatically.

To add a whole new section, append to `sections` and list its `id` in `layout.sidebar` or `layout.main` (that also sets the order).
Set `"hidden": true` on a section to keep its data but not show it.

`data/cv.schema.json` is referenced from the JSON, so VS Code (and most editors) autocomplete and flag mistakes while you type.

> Static parts of `index.html` (`<title>`, description, Open Graph tags, favicon) are not generated from the JSON
> on purpose: link-preview crawlers don't run JavaScript. Edit them in `index.html` if your name or headline changes.

## Layout

```
index.html                  shell: meta tags, stylesheets, <div id="app">
data/
  cv.json                   ALL content (profile, sections, layout, GitHub settings, footer)
  cv.schema.json            editor validation / autocomplete
assets/
  css/
    tokens.css              colours + the three themes
    base.css                reset, fonts, focus
    topbar.css              sticky bar, theme swatches, buttons
    layout.css              sheet, header band, two columns, footer, reveal
    components.css          experience, projects, education, chips, lists
    print.css               clean A4 résumé when printing
  js/
    main.js                 entry: load -> render -> wire behaviour
    data.js                 fetch + validate cv.json
    page.js                 assembles the page (pure, testable in Node)
    sections/               one renderer per section `type`
      index.js              registry: text, skillGroups, linkList, timeline, education, projects, github
    ui/                     topbar, header, footer, theme, reveal, avatar
    features/github.js      live repo list + sync status (falls back to cv.json)
    lib/                    dom (escaping), dates, icons
```

### Extending

- **New section type:** add `assets/js/sections/<name>.js` exporting `render(section, ctx)`, register it in `sections/index.js`.
- **New theme:** add a `[data-theme="x"]` block to `tokens.css` and an entry in `ui/theme.js`.
- **New contact icon:** add it to `lib/icons.js`, then use it as a contact `type`.

Everything from the JSON is HTML-escaped and links are limited to `http(s)`, `mailto`, `tel` and relative URLs.

## Differences from the single-file version

- Same look, themes, print layout, scroll animation, live GitHub list and duration badges.
- The duration badge colour now follows the theme (it was a fixed grey), and the Activities entry no longer uses inline styles.
- The unused `.act--print` rule was removed.
