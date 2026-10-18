# Licences for assets added in the animation + audio upgrade (18 Oct 2026)

| Asset | Source | Licence / status |
|---|---|---|
| All CSS / SVG animation, `components/Burst.tsx` (star and crescent shapes) | written for this project | project's own |
| `public/assets/audio/sfx/card-pop.mp3`, `twinkle.mp3` | synthesized with numpy sine waves (`tools-audio/gen_sfx.py`) | own-generated, CC0 |
| `public/assets/audio/wrong-cue.mp3` | re-encoded copy of the game's existing `Preview-Mine.mp3` (metadata stripped) | same as the game's existing voice clips |
| `public/assets/audio/voice/*.mp3` (greeting, "try the other picture", end line, "Let's help!") | Kokoro-82M, local, voice `af_heart` (`tools-audio/gen_voice.py`) | Kokoro weights are Apache-2.0, but these lines are **PRIVATE-TEST PLACEHOLDERS**: the voice does not match the existing narrator. Replace with the original narrator voice (or a voice on a plan that allows commercial use) before publishing. |
| Google Flow / AI images / video | not used | — |
