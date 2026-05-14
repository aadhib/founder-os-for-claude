# Founder OS — website

The marketing landing page for [founderos.dev](https://founderos.dev).
Intentionally a **static, zero-framework** page — fast, trivial to deploy
anywhere, and nothing to maintain.

## Structure

```
website/
├── public/          the site — deploy this directory as-is
│   ├── index.html
│   ├── styles.css
│   ├── app.js       copy-to-clipboard, no dependencies
│   └── logo.svg
└── scripts/
    ├── build.js     copies public/ → dist/
    └── check.js     CI sanity check (used for lint + test)
```

## Develop

```bash
pnpm --filter @founder-os/website dev     # serves public/ on :4321
```

## Build

```bash
pnpm --filter @founder-os/website build   # → website/dist/
```

## Deploy

`website/dist/` (or `website/public/` directly) is a static bundle — point any
static host at it: Vercel, Cloudflare Pages, GitHub Pages, Netlify.

For Vercel, set the project root to `website/`, build command
`node scripts/build.js`, output directory `dist`.

## Design

Dark, premium, consistent with the brand palette in
[`../screenshots/README.md`](../screenshots/README.md): background `#0a0a0b`,
accent `#8b5cf6`, highlight `#bef264`.
