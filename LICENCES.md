# Licences for assets added in the animation + audio upgrade (18 Oct 2026)

| Asset | Source | Licence / status |
|---|---|---|
| All CSS / SVG animation, `components/Burst.tsx` (star and crescent shapes) | written for this project | project's own |
| `public/assets/audio/wrong/wrong-oh.mp3`, `wrong-boop.mp3`, `wrong-sigh.mp3` (gentle wrong-answer cues) | synthesized with numpy sine/partials, no samples (`tools-audio/gen_wrong_cues.py`), then loudness-matched (`tools-audio/normalize.py`) | own-generated, CC0 |
| `public/assets/audio/wrong/wrong-mine.mp3` | the game's existing narrator clip `public/Preview-Mine.mp3`, leading silence trimmed, 5/30 ms fades, loudness-matched | same as the game's existing voice clips (project's own narrator) |
| `tools-audio/src/card-pop.mp3`, `twinkle.mp3` (sources) | synthesized with numpy sine waves (`tools-audio/gen_sfx.py`) | own-generated, CC0 |
| `tools-audio/src/voice/*.mp3` (greeting, "try the other picture", end line, "Let's help!") | Kokoro-82M, local, voice `af_heart` (`tools-audio/gen_voice.py`) | Kokoro weights are Apache-2.0, but these lines are **PRIVATE-TEST PLACEHOLDERS**: the voice does not match the existing narrator. Replace with the original narrator voice (or a voice on a plan that allows commercial use) before publishing. |
| `public/assets/audio/final/*.mp3` | loudness-matched copies (gain + limiter only, no re-recording) of the game's existing clips and the sources above, built by `tools-audio/normalize.py`. Originals are untouched. | same as their sources |
| Google Flow / AI images / video | not used | — |
