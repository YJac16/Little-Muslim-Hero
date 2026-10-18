# AI review log (18 Oct 2026)

Rubric (each /10, OVERALL = average): fun for ages ~3-6, clarity, animation, audio completeness, accessibility/mobile, bugs/polish.
Reviewer: **Claude** (claude.ai chat, box browser). Replies are saved verbatim in `docs/reviews/`.
Reviewed from screenshots and frame strips plus a text description of the audio behaviour (the reviewer cannot hear audio). Not reviewed: ChatGPT (not signed in on the box browser), Gemini (signed out, no API key on the box).

| Round | Fun | Clarity | Animation | Audio* | Access/mobile | Bugs | OVERALL |
|---|---|---|---|---|---|---|---|
| 1 | 6.0 | 6.0 | 6.8 | 6.0 | 6.0 | 6.5 | 6.2 |
| 2 | 6.6 | 6.4 | 7.1 | 6.5 | 6.8 | 6.7 | 6.7 |
| 3 | 6.9 | 7.0 | 7.5 | 6.8 | 7.1 | 7.2 | 7.1 |
| 4 | 7.2 | 7.6 | 7.8 | 7.1 | 7.5 | 7.6 | **7.5** |

*Scored as if the original narrator voice replaces the four placeholder lines. Reviewer's placeholder penalty: about -1.2 on Audio (about -0.2 overall).

**9.0 was not reached** after the 4-round limit. Reviewer's remaining items after round 4: keep "Try again" up until the pulse ends; landscape art looks small and the 1/5 counter should sit on the art; shorten crossfade ghosting; small text and greyer desktop end screen; replay depth (a second interaction type or a collectible). Reviewer's view of what 9.0 needs beyond code: friend/sharing art, more content variety, a real narrator, Islamic-content review of duas, and observed play with children aged 3-6.

## Round 5 (audio-only change: wrong-answer cues for every moment + loudness matching)
Reviewer: Claude (same method; cannot hear audio, scored from design + test evidence). Reply verbatim in `docs/reviews/claude-round-5.md`.
Fun 7.5, Clarity 8.1, Animation 7.2, Audio 7.6, Access/mobile 7.5, Bugs/polish 7.5, **OVERALL 7.6** (R4 was 7.5). Placeholder-voice penalty -0.5 separately (effective 7.1 with the current TTS). **9.0 not reached.**
Reviewer did not have its own per-category R4 numbers in that chat, so the category deltas are not comparable. Open items: replace the 4 placeholder voice lines (incl. "Try the other picture", the most repeated), listen for clicks at the synthesized cue note onsets (spectrogram shows vertical lines; not heard by us), trim the tail of wrong-mine, test on real iOS/Android phones (audio unlock, latency, overlapping rapid taps), larger tap targets. Cannot be judged without ears: how the cues actually sound.

## Round 6 (whole-game audio revision: new sfx, ambience, regenerated placeholder voices, per-moment Mine table)
Reviewer: Claude (same method; cannot hear audio). Reply verbatim in `docs/reviews/claude-round-6.md`.
Fun 7.7, Clarity 8.0, Animation 7.3, Audio 8.3, Access/mobile 7.2, Bugs/polish 7.6, **OVERALL 7.7** (R5 was 7.6). Placeholder-voice penalty -0.5 separately. **9.0 not reached**; the reviewer says the remaining distance is visuals, real-phone testing, a real narrator and licences, not audio code.
Open items from the reviewer: listen on a real phone speaker (low-pitched cues, tap and bedtime pad may be quiet); pitch mismatch of the 3 single-word previews; add the 2nd-wrong-pick retry-pop to the automated check (done after this review); check ambience does not grate or mask the question (levels: ambience -39 LUFS vs voice -20, ducked to -49); delete the clipping orphan `Gentle-pop-for-retry.mp3` (left for the founder's decision); nasheed licence unknown; placeholder voices.
