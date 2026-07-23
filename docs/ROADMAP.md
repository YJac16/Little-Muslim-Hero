# Little Muslim Hero — Product Roadmap

Positioning: **“The calm daily-routine game for ages 2–4 — pictures + voice, no ads, no reading.”** Compete on focus and toddler UX, not catalog size against streaming platforms.

## Phase 0 — Ship & connect (done in polish PR)

- Static export to `out/` with [`vercel.json`](../vercel.json)
- Cursor → GitHub → Vercel workflow documented in [`README.md`](../README.md)

## Phase 1 — Mobile + toddler-first UI (done in polish PR)

- Short-phone / landscape layouts so CTAs and choices never clip
- Kid path with minimal text; icon sound control
- Choice preview audio, success narration, mascot emotion feedback
- Installable PWA icons + manifest

## Phase 2 — Parent trust & session quality

- Parent menu **PIN** (replace “Coming soon”)
- Persist day progress + sound in `localStorage`
- Optional “Replay this moment” without full reset
- Softer audio ducking (nasheed quieter under narration)
- Larger focus rings for parents; honor `prefers-reduced-motion` (partially in place)

## Phase 3 — Content depth (genre table stakes)

Competitors win on **library**, not one demo day. Keep picture+audio-only play:

- Multiple **Barakah Days** / seasonal packs (Jumuah, Ramadan evenings, travel day)
- Mini-moments: simple duas, clean-up, sharing, wudu-ready habits (age-appropriate)
- More variety in correct/neutral pairs so replay isn’t memorized left/right
- Generalize [`lib/levels.ts`](../lib/levels.ts) to packs (still static for static hosting)

## Phase 4 — Retention without dark patterns

Toddler games need **parent-visible** progress, not addictive loops:

- Sticker / star board after a completed day (local only)
- Gentle “continue tomorrow” framing; no countdown pressure
- Optional weekly parent summary (moments practiced)
- Offline shell (service worker cache of `out/` assets)

## Phase 5 — Differentiation vs genre leaders

| Differentiator | How |
|---|---|
| Ultra-young UX | Bigger taps / fewer words than quiz or dua-text apps |
| Routine narrative | One coherent day arc vs isolated minigames |
| Ad-free / calm | Soft nasheed + celebration only |
| Parent control | PIN, jump, sound, later multi-profile |

Then: EN + simple AR audio packs; mascot as consistent hero brand; optional Capacitor/TWA wrapper after PWA retention proves out.

## Phase 6 — Platform & growth

- Custom domain on Vercel; OG/share image for WhatsApp family sharing
- Privacy-safe analytics (aggregate completes only; no child PII)
- Soft launch to parent communities; iterate from drop-off
- Store packaging only after Phase 3–4 content depth
