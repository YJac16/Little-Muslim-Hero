# Recording script: the 4 lines the founder records himself

The four spoken lines below currently use a **synthetic placeholder voice** (private testing only).
The narrator's other 13 clips are the original recordings and are untouched. To publish, record these four
lines in the **same voice and style as the existing narrator** (warm, slow, smiling; about 2 words per second;
a short natural pause between sentences), or buy a commercial voice licence.

## The lines (exact words, file names, target length)

| # | File name (keep exactly) | Say exactly | Target length | When it plays |
|---|---|---|---|---|
| 1 | `Intro-Assalamu-alaikum-little-hero.mp3` | "Assalamu alaikum, little hero! ... Let's start our day." | 3.0 to 3.6 s | once, after tapping Start, before the first question |
| 2 | `Retry-Try-the-other-picture.mp3` | "Try the other picture." | 1.2 to 1.6 s | after the first wrong pick in each moment (the most repeated line) |
| 3 | `End-MashaAllah-you-did-it-little-hero.mp3` | "MashaAllah! You did it, little hero!" | 2.2 to 2.8 s | end screen, after the celebration sound |
| 4 | `Preview-Help.mp3` | "Let's help!" | 0.8 to 1.2 s | Helping Time, when the helping picture is chosen |

Placeholder lengths for reference: 3.5 s, 1.5 s, 2.8 s, 1.1 s.

## How to record
- Quiet room, soft furnishings, phone or mic about 15 to 20 cm from your mouth, a little off to the side to avoid pops.
- Record each line 3 times and keep the best. One line per file. Leave about 0.2 s of silence before and 0.3 s after (the other clips have about 0.3 s of tail).
- Do not worry about volume: the loudness tool matches everything to -20 LUFS. Just do not clip (no red on the meter).
- Export as MP3 or WAV, mono or stereo, 44.1 or 48 kHz. Name the files exactly as in the table.

## How to drop them in
1. Easiest: put the four files in `tools-audio/src/voice/` (replace the existing ones), then run `cd tools-audio && python3 normalize.py` (needs ffmpeg). It loudness-matches them into `public/assets/audio/final/`.
2. No Python: copy the four files straight into `public/assets/audio/final/` over the existing names (keep them around -20 LUFS, peaks under -2 dBFS).
3. Run `python3 tools-audio/verify_moments.py http://localhost:4173/` to confirm every moment still has voice + sound effects.

Then update the row for these files in `LICENCES.md` to "recorded by the founder, project's own".

## Optional, only if wanted
- A different spoken wrong-pick word per moment (today only Play Time starts with the narrator's "Mine"). Record it as a short clip (under 1 s), put it in `public/assets/audio/wrong/`, add it to `WRONG` in `lib/media.ts` and to that moment in `lib/wrongCues.ts`.
