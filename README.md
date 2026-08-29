# Little Muslim Hero — My Barakah Day

Mobile-first Islamic toddler web game (ages 2–4): a **choice-based daily routine** with **pictures and audio** — no reading required.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- React 19
- Tailwind CSS
- Static assets in `/public`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy — Cursor ↔ GitHub ↔ Vercel

There is no Vercel MCP in Cursor Cloud. Shipping works through **Git**:

```text
Cursor edits → push to GitHub → Vercel builds `out/` → phone / tablet
```

### One-time setup (account owner)

1. In [Vercel](https://vercel.com/) → **Add New Project** → import [`YJac16/Little-Muslim-Hero`](https://github.com/YJac16/Little-Muslim-Hero) (or link an existing project to this repo).
2. In **Cursor Desktop** → connect **GitHub** under Integrations so pushes from Cursor land on the same repo.
3. Vercel’s Git integration then deploys on each push to the production branch (usually `main`).

### Vercel MCP in Cursor

This repo includes [`.cursor/mcp.json`](.cursor/mcp.json) pointing at the official server `https://mcp.vercel.com`.

1. Open the project in **Cursor Desktop** (or reload the window).
2. When the Vercel MCP shows **Needs login**, click it and complete the Vercel OAuth flow.
3. After auth, agents can inspect projects, deployments, and logs via Vercel MCP tools.

You can also install/reinstall with:

```bash
npx add-mcp https://mcp.vercel.com -a cursor -n vercel -y
```

### Build settings (static export)

This app uses [`next.config.ts`](next.config.ts) → `output: "export"`, which writes the site to **`out/`**. [`vercel.json`](vercel.json) pins that folder.

| Setting | Value |
|--------|--------|
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `out` (must match static export; do **not** use `.next` or `public` alone) |
| **Environment variables** | None |

If dashboard overrides conflict, turn overrides **off** so `vercel.json` applies, or set **`out`** manually.

### Optional CLI

From the repo root (after `npx vercel login` once):

```bash
npx vercel        # preview
npx vercel --prod # production
```

### “404: NOT_FOUND” on `*.vercel.app`

Usually **Output Directory** did not match the build (e.g. `.next` or empty while the site is exported to **`out`**). This project **must** publish the **`out`** folder after `npm run build`. Redeploy after pulling latest `main`; in Vercel settings, set **Output Directory** to **`out`** or rely on [`vercel.json`](vercel.json).

## Product roadmap

See **[docs/ROADMAP.md](docs/ROADMAP.md)** for Phases 0–6 (mobile polish → parent trust → content depth → retention → differentiation → growth).

## Assets — add your files

**Images & most voice clips** live next to `public` (URL = `/filename.png` / `/filename.mp3`). **Nasheed** may stay in `public/assets/audio/`. Paths are centralized in **`lib/media.ts`**.

### Audio (`public/assets/audio/`)

| File | Use |
|------|-----|
| `nasheed-bg.mp3` | Soft ~96s mono loop (play + end; ducks under narration) |
| `sfx/ui-whoosh.mp3` | Start / Play Again |
| `sfx/ui-tap.mp3` | Soft UI taps |
| `sfx/success-chime.mp3` | Correct choice |
| `sfx/retry-pop.mp3` | Gentle retry |
| `sfx/celebrate.mp3` | End-of-day celebration |

Narration and choice preview clips live at the `public/` root and are wired in **`lib/media.ts`**.

### Images

Scenes, choices, and mascot PNGs live at the `public/` root (wired in **`lib/media.ts`**). PWA icons: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

## Parent menu

**Tap and hold** the mascot (about **3 seconds**) on the start screen, in-level corner badge, or end screen to open the parent menu: jump to any part of the day, toggle sound, or reset progress.

## Project structure

- `app/page.tsx` — entry
- `app/layout.tsx` — fonts, metadata, PWA icons
- `components/Game.tsx` — flow (start → five moments → end)
- `components/Level.tsx` — scene, narration, outcomes
- `components/ChoiceButton.tsx` — large image choices
- `components/ParentMenu.tsx` — hidden parent controls
- `lib/media.ts` — image/audio URLs
- `lib/levels.ts` — routine data
- `styles/globals.css` — theme + animations
- `public/` — images, audio, manifest, icons
- `docs/ROADMAP.md` — competitive product phases

## License

Use and adapt for your family or product as you see fit.
