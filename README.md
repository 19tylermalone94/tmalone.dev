# tmalone.dev

Personal portfolio for **Tyler Malone** — Software Engineer (full-stack · DevOps · agentic AI).

A single-page static site with no build step. The page is a scroll **descent from space to the ocean floor**: each section is an atmospheric/terrestrial layer (space → exosphere → mountains → forest → coast → underwater), backed by real public-domain imagery.

## Stack

Plain **HTML / CSS / JS** — no framework, no build.

```
index.html              markup (content verbatim from site-content.md)
assets/css/styles.css    the cosmic theme
assets/js/main.js        starfield, scroll reveals, parallax, progress bar
assets/img/*.jpg         optimized imagery
site-content.md          source copy of all page content
```

## Run locally

Just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy

This is a **static site** — there is no build command. On Vercel, set the project's
**Framework Preset to "Other" (no build)** and serve from the repository root.

## Image credits

All imagery is public domain or CC0: **NASA / ESA / STScI** (space & atmosphere),
**USGS / NPS / NARA** and **Wikimedia Commons / Unsplash CC0** (landscapes, underwater).
