# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

Landing page for EG Mechanical (HVAC & plumbing, Alexandria VA), built with
Astro 5 + React (for interactive islands) + Tailwind CSS, deployed to Vercel
at `https://egmechanic.com`. `output: 'server'` with `@astrojs/vercel` as the
adapter — the site is hybrid-rendered: most pages are prerendered to static
HTML at build time, while `src/pages/api/contact.ts` runs on-demand as a
serverless function.

## Package manager

**npm** (`package-lock.json` is the lockfile — do not add a `pnpm-lock.yaml`
or `yarn.lock`).

- `npm run dev` — local dev server
- `npm run build` — production build (also runs image optimization via
  `astro:assets` + `sharp`)
- `npm run preview` — **does not work**: the `@astrojs/vercel` adapter does
  not support `astro preview`. To sanity-check a production build locally,
  serve `dist/client` with any static file server instead (e.g.
  `python3 -m http.server` from that directory) — this only exercises the
  prerendered pages, not the `/api/contact` function.

## Rendering: prerender vs. server

Because `output: 'server'`, every route is server-rendered by default unless
it opts out. Any page whose content doesn't depend on the request (currently
`index.astro`, `about.astro`, `projects.astro`) must start with:

```astro
---
export const prerender = true;
---
```

Only `src/pages/api/contact.ts` should stay server-rendered (it already sets
`export const prerender = false`, matching the default for that route).
Adding a new static page without `prerender = true` silently makes it SSR on
every request instead of a cached static file — always add it for new
content pages.

## Images

Local images must live under `src/assets/` and be imported as ES modules,
**never** dropped in `public/` and referenced by string path. `public/` skips
Astro's image pipeline entirely (no resizing, no format conversion, no
`width`/`height`, no lazy loading).

- Regular `<img>` replacement: use the `Image` component.

  ```astro
  ---
  import { Image } from "astro:assets";
  import photo from "../assets/images/example.jpeg";
  ---
  <Image src={photo} alt="Descriptive alt text" class="..." />
  ```

  This gives automatic WebP conversion, correct `width`/`height` (prevents
  layout shift), and `loading="lazy"` by default.

- CSS `background-image` (can't use `<Image>` directly): use `getImage()` in
  the frontmatter and inline the resulting URL.

  ```astro
  ---
  import { getImage } from "astro:assets";
  import bg from "../assets/images/example.jpeg";
  const optimized = await getImage({ src: bg, format: "webp", quality: 60 });
  ---
  <div style={`background-image: url('${optimized.src}')`}></div>
  ```

  Don't pass a `width` larger than the source image's native resolution —
  `getImage` will upscale and re-encode, which can make the output *larger*
  than the original instead of smaller.

- `favicon-logo.ico` and everything in `public/icons/` (SVGs) are the
  exception — small static assets served at a fixed path (favicon link,
  inline icons) don't need the pipeline. Prefer the SVG logo
  (`public/icons/transparent-logo.svg`) over the `.ico` for any *visible*
  on-page logo; the `.ico` is only appropriate for the `<link rel="icon">`
  favicon.

## Contact form / email

`src/pages/api/contact.ts` sends form submissions via Resend and verifies a
Cloudflare Turnstile token server-side before sending. Required environment
variables (set in Vercel project settings, not committed):

- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`

The Turnstile site key is public and lives inline in `src/components/Form.astro`.

## SEO / structured data

`src/components/SchemaMarkup.astro` holds the `LocalBusiness` JSON-LD (hours,
service area, offer catalog). `src/layouts/Layout.astro` sets per-page
`title`/`description` via `<Layout title="..." description="...">` props —
every new page should pass both rather than relying on the defaults.
