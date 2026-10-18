Claude responded: Scores (strict; 9.0 = hand it to a family as-is)
Updated memory
little-muslim-hero.md

Updated memory little-muslim-hero.md

Scores (strict; 9.0 = hand it to a family as-is)

Fun for ages ~3-6: 6.0. The art is warm, the star burst is rewarding, and the hero is lovable. But it is five binary taps (a couple of minutes), and the payoff is thin. After the right pick in 1/5, the hero is still asleep under the stars. A 5-6-year-old will find it trivially easy, and a 3-year-old may not read the difference between the two pictures. There is little reason to replay beyond “Play Again”.
Clarity: 6.0. One tap, two choices, a huge Start button, a gold ring on the right card and a replay speaker are all good. The problems:
In portrait the scene takes about 61% of the height and the choices that matter get about 14%.
The moment-2 “right” art (a boy alone with blocks) doesn’t show sharing, and the “friend” in the question never appears.
The “Mine” clip plays for every wrong pick, even where nobody is being possessive (see the first fix below).
The “Listen / Please wait…” state is text-only dead time.
The correct card is first (left or top) in both moments I can see.
Animation quality and flow: 6.8. The enter sequence is clean, the wrong pick is correctly subtle, and the star burst is colorful and readable. The burst looks like it lasts only about 0.5 s across the strip (stars appear in frame 2 and are gone by frame 4), which is short for a toddler to register. The reward also doesn’t change the picture, so the hero never reacts. The sheer amount of simultaneous motion (drift, light sweep, bob, twinkle) may be busy for sensitive kids, though reduced-motion helps.
Audio completeness: 6.0 (provisional). The pipeline is complete: greeting, narration, cue, feedback, praise, end, replay and ducking. Against that, the four placeholder-TTS lines are the first and last things a child hears, plus the correction line, so the narrator changes voice at the worst moments. There is also no hint after repeated wrong picks, and no idle re-prompt.
Accessibility and mobile fit: 6.0.
Good: reduced-motion support, captions, replay, and portrait and landscape layouts.
Contrast: the orange “My Barakah Day” on cream, white on the light green “Start the Day”, and white on the light blue “Play Again” (the weakest, roughly 2:1) all look under 3:1.
Controls: the top-right mute and the caption replay are both speaker icons in white tiles, so they are easy to confuse. A toddler can mute the game by accident. The “tap the hero 5 times” gate is printed on screen, and toddlers tap characters constantly.
Bugs / polish: 6.5.
Landscape crop: in 2/5 the hero’s head and hat are cropped off.
Ghosted background: the start and end screens show a large blurred ghost of the hero and bed behind the avatar, which reads as a double image.
Dull end sky: the end-screen sky is a muddy gray rather than a warm night.
Strip-enter glitch: frame 1 has a faint pink smudge in the empty card tray, and frame 2 has a circular icon on top of a card. If that icon is a loading glyph it looks like a play button that does nothing.
Clutter: there are up to three hero faces on screen (scene, top-left badge, emotion badge).

OVERALL: 6.2. This is a charming prototype, not a handoff yet.

Cannot judge from stills:

Motion timing, easing and jank, and performance on budget Android, where blurred backgrounds plus drift animation can be heavy.
All audio quality: voice warmth, pronunciation, loudness, mix, ducking and nasheed content.
Whether taps are ignored during voice lines.
Screen-reader, keyboard and focus behavior, and notch safe areas.
Moments 3-5, which I never see.
Whether the answer position is randomized. Two of two correct cards being first is consistent with a fixed order but could be chance.

Top 5 must-fix, in priority order

Per-moment wrong cue. Remove the single “Mine” clip from the generic wrong path. Use a wrongCue field per moment (keep “Mine” only for Play) and fall back to blip + “Try the other picture”. “Mine” after hiding under a blanket is a non-sequitur. Repeated wrong picks should never stack blip + clip + line.
Rebalance portrait layout. Cap the scene at max-height: 46dvh and give the choices aspect-ratio: 1/1; width: calc(50% - 8px), so they reach about 170 px square on a 390 px phone. From the sheet, the cards are currently about 155×115 px. Make the whole card the <button>, with a 12-16 px gap. Also show the chosen art on a right pick: crossfade the scene to the selected card’s picture for about 1.2 s (the boy sits up, the boy shares) before advancing.
Stuck-child help and shuffled answers. After 2 wrong picks, or 10 s idle, replay the question once and pulse the correct card (scale 1→1.06 with a gold glow, 3 loops). Cap it at 2 prompts. Shuffle the card order per moment, and avoid the same side twice in a row.
Parent gate and mute.
Replace 5 taps with a press-and-hold of about 3 s, with a filling ring.
Change or remove the on-screen instruction.
Move mute into the parent menu, or give it a distinct icon (speaker with slash or music note) and a larger hit area.
Make the caption replay a distinctly different “replay” glyph.
Contrast and landscape crop. Darken the subtitle (about 
#B8500A), and use dark green or navy text on the buttons, or darken the fills (white on 
#2E9E4F passes for large bold text). In landscape, set a per-scene object-position (e.g. 50% 15%) so the hat and face aren’t cropped.

Blocker outside the top 5 (not code): re-record the four placeholder lines with the real narrator before any family test. This especially matters for “Assalamu alaikum” and “MashaAllah”, because Arabic phrases mispronounced by an English TTS voice are the most likely thing to put off Muslim parents.

Cultural and religious notes. Nothing from the stills looks wrong, but check these:

Music: families differ on instruments. Check that the nasheed is vocals/duff-only, keep the chime and twinkle SFX light, and add a “voice only” switch in the parent menu. Also confirm the nasheed’s licence and lyrics.
Figural imagery: a child’s face is mainstream in Muslim kids’ media, but some conservative families avoid it. That is a market decision, not an error.
Duas: “Alhamdulillah” on waking is a fair toddler simplification of the full dua, and “Bismillah” before the meal is right. Consider showing the full dua and transliteration in the parent menu, and check the bedtime one, which I can’t see.
Kufi in bed: the boy sleeps in his kufi in the morning scene. It’s harmless but unrealistic, so consider a bare head for sleep and wake art.
Star-and-crescent confetti: this is a cultural motif and is fine as decoration.





just now