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

## Deploy (Vercel)

1. In [Vercel](https://vercel.com/) → **Add New Project** → import [`YJac16/Little-Muslim-Hero`](https://github.com/YJac16/Little-Muslim-Hero).
2. **Framework Preset** → **Next.js** (required). Do **not** use “Other” or “Static Site” unless you know what you’re doing.
3. **Root Directory** → leave empty (repo root). No environment variables.
4. **Build & Development Settings** → prefer **Override** toggles **off** so Vercel uses defaults. If you overrode them, use:

| Setting | Value |
|--------|--------|
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | **Leave empty** — never set `.next`, `out`, or `public` for this app. |

This repo includes [`vercel.json`](vercel.json) with install/build commands only (no output folder).

After the first deploy, each push to `main` triggers a new production deployment.

### “404: NOT_FOUND” on `*.vercel.app`

Almost always **wrong framework** or **Output Directory**. In **Project → Settings → General → Build & Development Settings**: set framework to **Next.js**, **clear Output Directory completely**, save, then **Deployments → … → Redeploy** the latest build. Open the **Production** domain from the project overview, not an old deployment URL.

## Assets — add your files

Place files under `public` so URLs start with `/assets/...`.

### Audio (`public/assets/audio/`)

| File | Use |
|------|-----|
| `nasheed-bg.mp3` | Soft looping background nasheed (play + end screens; respects Sound toggle) |
| `narration-morning.mp3` | Morning scene prompt |
| `narration-play.mp3` | Play time prompt |
| `narration-meal.mp3` | Meal time prompt |
| `narration-help.mp3` | Helping time prompt |
| `narration-bed.mp3` | Bedtime prompt |
| `preview-good.mp3` | “Good” choice when tapped |
| `preview-neutral.mp3` | Other choice when tapped |
| `success.mp3` | Success chime |
| `retry.mp3` | Gentle “try again” |

### Images (`public/assets/images/`)

| File | Use |
|------|-----|
| `mascot.png` | Logo / celebrations |
| `morning-scene.png` | Morning background |
| `play-scene.png` | Play time |
| `meal-scene.png` | Meal time |
| `helping-scene.png` | Helping time |
| `bedtime-scene.png` | Bedtime |
| `morning-good.png`, `morning-neutral.png` | Morning choices |
| `play-good.png`, `play-neutral.png` | Play choices |
| `meal-good.png`, `meal-neutral.png` | Meal choices |
| `helping-good.png`, `helping-neutral.png` | Helping choices |
| `bedtime-good.png`, `bedtime-neutral.png` | Bedtime choices |

Paths are defined in **`lib/media.ts`** — if your filenames differ, update that file so they match what is in `public/assets/`.

## Parent menu

**Tap and hold** the mascot (about **3 seconds**) on the start screen, in-level corner badge, or end screen to open the parent menu: jump to any part of the day, toggle sound, or reset progress.

## Project structure

- `app/page.tsx` — entry
- `app/layout.tsx` — fonts, metadata, global styles
- `components/Game.tsx` — flow (start → five moments → end)
- `components/Level.tsx` — scene, narration, outcomes
- `components/ChoiceButton.tsx` — large image choices + audio
- `components/ParentMenu.tsx` — hidden parent controls
- `lib/media.ts` — image/audio URLs (edit when your filenames differ)
- `lib/levels.ts` — routine data
- `styles/globals.css` — theme + animations
- `public/assets/` — images and audio

## License

Use and adapt for your family or product as you see fit.
