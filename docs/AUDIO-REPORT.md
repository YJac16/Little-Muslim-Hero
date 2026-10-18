# Audio audit and revision (18 Oct 2026, evening, round 6)

All numbers are measured, not guessed: `tools-audio/audit.py` (ffmpeg loudnorm + numpy) writes the raw tables in
`tools-audio/reports/` (`audit-main.md` = the game as on `main`, `audit-prhead.md` = PR #5 before this round, `audit-after.md` = now).
**Nobody on the team has listened to the new sounds yet** (no audio device here). Pitch, timbre, pace and levels were measured and
spectrograms inspected; whether it all sounds good is for the founder's ears. A Whisper speech-to-text pass (`transcribe.py`) confirmed the words.

## Before / after

| Asset | Before | After | Verdict |
|---|---|---|---|
| 5 question narrations + 5 success lines (original narrator) | -29 to -36 LUFS on `main`; -20.4 in PR head; abrupt cut at the end of some | -20.4 LUFS, peaks <= -2.4 dBFS, 30 ms fade-out, voice untouched | consistent level |
| 3 "preview" words (Alhamdulilah, Bismillah, Share) | -20 to -26 LUFS | -20.4 | note: their pitch is 100 to 130 Hz vs 180 to 310 Hz for the sentences: a deeper voice or a measuring artefact, **listen** |
| 4 placeholder lines (greeting, try-the-other-picture, end, "Let's help!") | Kokoro `af_heart`, ~15% faster than the narrator, 0.01 to 0.05 s tails (abrupt), "Assalamu" and "MashaAllah" read the English way | Kokoro `af_jessica` at 0.80: pace 13.4 s vs narrator 13.6 s on six matched sentences, pitch 204 to 222 Hz vs narrator ~231, Arabic words hand-phonemed, 0.15 to 0.18 s tails | closer and cleaner, still **placeholder** |
| ui-tap, card-pop, ready sounds | sine blips, ui-tap centroid 1.4 kHz, mixed peak levels | soft wooden "tok" and bubble "bloop", low-passed, centroid 0.55 and 0.68 kHz | warmer |
| retry-pop (2nd+ wrong pick) | one 0.14 s low blip (centroid 0.35 kHz) | two soft rising marimba notes, 0.6 s | friendlier "your turn" |
| success-chime | 0.59 s, -37 LUFS on `main` | 1.3 s warm bell arpeggio C-E-G, -26.4 | fuller |
| twinkle | 0.9 s, centroid 1.9 kHz | centroid 1.5 kHz, reverb, low-passed | softer |
| **celebrate (end screen)** | 0.7 s at **-50 LUFS** on `main` (nearly inaudible) | 2.4 s soft marimba run + bells + warm chord, -26.4 | gap fixed |
| ui-whoosh | centroid 2.2 kHz (hissy) | airy swish, centroid 1.2 kHz | softer |
| wrong cues (oh, boop, sigh) | 8 ms attack (the reviewer flagged onset transients) | 14 ms attack, otherwise same; Mine tail trimmed 0.73 to 0.33 s | cleaner |
| Per-scene ambience | none | 5 quiet synthesized loops, ducked under voices | new, **listen** |
| Nasheed bed | -22 LUFS file, plays at -34 idle / -44 ducked, no clipping, loop seam fades smoothly (dip to -35 dB for ~1 s every 96 s) | unchanged | fine; licence unknown |

Clipping: none in any game clip (0 samples >= 0.995). Only the **unused** orphan `Gentle-pop-for-retry.mp3` clips (226 samples, +2.3 dBFS): recommend deleting it.
Noise: the recordings sit on a quiet floor (-50 to -70 dBFS between words); no hum or hiss stood out in the measurements.

## Levels at playback (LUFS, the number the child hears)
voice -20 (x0.95 to 1.0) | wrong cue -21 | success chime -26 | celebrate -27 | twinkle -29.5 | nasheed -34 idle, -44 under voice | ambience -39 idle, -49 under voice.
The voice is always the loudest thing; sound effects sit 6 to 10 dB below it; beds 14 to 19 dB below.

Note on brightness: note content of the synthesized sounds is mostly under 5 kHz; the celebrate and twinkle bells have a few quiet partials near 7 kHz. The wrong cues, tap and bedtime pad are low in pitch (550 Hz centroid, 110 Hz pad): on a phone speaker the pad will be barely audible, the cues stay audible because their notes sit at 390 to 780 Hz. **Test on a real phone speaker.**

## Gaps found and fixed
- End screen: celebration was 0.7 s and inaudible (-50 LUFS). Fixed.
- Per-moment ambience missing. Added, switchable (`AMBIENCE_ENABLED`, `AMBIENCE_VOLUME` in `lib/media.ts`).
- Four placeholder voice lines: re-generated and a recording script written for the founder (`docs/RECORDING-SCRIPT.md`).
- Voice clip ends cut hard: 5/30 ms fades added.
- "Mine" per moment is now one table in `lib/wrongCues.ts`, plus `WRONG_MODE` and a `?wrong=mine|soft|moment` URL override for trying it on a phone.

## Checks
`python3 tools-audio/verify_wrong_picks.py URL` (every wrong pick has a cue) and `python3 tools-audio/verify_moments.py URL` (every moment has question voice, ready sfx, ambience, wrong cue + spoken retry, right pick preview voice + twinkle + chime + success voice, start whoosh and greeting, end celebrate and end voice, the `?wrong=mine` override, every file exists and decodes). Both PASS on the final build.
