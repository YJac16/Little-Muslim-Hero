/**
 * Paths = files in `public/` (URL starts with `/`).
 * Filenames match what you added at repo root / `public/assets/`.
 */
/**
 * WRONG-ANSWER CUE SET (swappable): every file in public/assets/audio/wrong/.
 * Replace a file (keep it < 1 s, gentle, ~-21 LUFS) or add one and list it here.
 * Which cue plays for each moment is set in lib/levels.ts (`wrongCues`).
 */
export const WRONG = {
  mine: "/assets/audio/wrong/wrong-mine.mp3", // the narrator's "Mine." (fits Play Time best)
  oh: "/assets/audio/wrong/wrong-oh.mp3",
  boop: "/assets/audio/wrong/wrong-boop.mp3",
  sigh: "/assets/audio/wrong/wrong-sigh.mp3",
} as const;

export const AUDIO = {
  /** Compressed ~96s mono loop (was 50min / 47MB). */
  nasheedBackground: "/assets/audio/nasheed-bg.mp3",
  /** Soft whoosh on Start / Play Again */
  uiStart: "/assets/audio/final/ui-whoosh.mp3",
  uiTap: "/assets/audio/final/ui-tap.mp3",
  celebrate: "/assets/audio/final/celebrate.mp3",
  narrationMorning:
    "/assets/audio/final/Morning-Intro-Good-morning-little-hero-When-we-wake-up-what-do-we-say.mp3",
  narrationPlay:
    "/assets/audio/final/Play-Intro-Your-friend-wants-to-play-What-should-we-do.mp3",
  narrationMeal: "/assets/audio/final/Meal-Intro-Before-we-eat-what-do-we-say.mp3",
  narrationHelping:
    "/assets/audio/final/Helping-Intro-Mommy-needs-help-What-can-we-do.mp3",
  narrationBed: "/assets/audio/final/Bedtime-Intro-Before-we-sleep-we-make-our-dua.mp3",
  previewAlhamdulilah: "/assets/audio/final/Preview-Alhamdulilah.mp3",
  previewBismillah: "/assets/audio/final/Preview-Bismillah.mp3",
  previewShare: "/assets/audio/final/Preview-Share.mp3",
  previewHelp: "/assets/audio/final/Preview-Help.mp3",
  /** PRIVATE-TEST placeholder voices (Kokoro). Replace before publishing. */
  introGreeting: "/assets/audio/final/Intro-Assalamu-alaikum-little-hero.mp3",
  retryVoice: "/assets/audio/final/Retry-Try-the-other-picture.mp3",
  endVoice: "/assets/audio/final/End-MashaAllah-you-did-it-little-hero.mp3",
  cardPop: "/assets/audio/final/card-pop.mp3",
  twinkle: "/assets/audio/final/twinkle.mp3",
  successChime: "/assets/audio/final/success-chime.mp3",
  retry: "/assets/audio/final/retry-pop.mp3",
  successNarrationMorning:
    "/assets/audio/final/Success-MashaAllah-Allah-loves-when-we-remember-Him.mp3",
  successNarrationPlay: "/assets/audio/final/Success-Sharing-makes-hearts-happy.mp3",
  successNarrationMeal: "/assets/audio/final/Success-Bismillah-brings-barakah.mp3",
  successNarrationHelping:
    "/assets/audio/final/Success-Helping-is-from-good-character.mp3",
  successNarrationBedtime: "/assets/audio/final/Success-Sleep-peacefully-little-hero.mp3",
} as const;

export const IMG = {
  mascot: "/mascot.png",
  mascotCelebrating: "/mascot-celebrating-pose.png",
  mascotHappy: "/mascot-happy-face.png",
  mascotConfused: "/mascot-confused.png",
  mascotNeutral: "/mascot-neutral-face.png",
  mascotRewardScene: "/mascot-reward-scene.png",
  successEffect: "/success-effect.png",
  morningScene: "/morning-scene.png",
  playScene: "/play-scene.png",
  mealScene: "/meal-scene.png",
  helpingScene: "/helping-scene.png",
  bedtimeScene: "/bedtime-scene.png",
  morningGood: "/morning-scene-choice-good.png",
  morningNeutral: "/morning-scene-choice-neutral.png",
  playGood: "/play-scene-choice-good.png",
  playNeutral: "/play-scene-choice-neutral.png",
  mealGood: "/meal-scene-choice-good.png",
  mealNeutral: "/meal-scene-choice-neutral.png",
  helpingGood: "/helping-scene-choice-good.png",
  helpingNeutral: "/helping-scene-choice-neutral.png",
  bedtimeGood: "/bedtime-scene-choice-good.png",
  /** File name uses `bed-time-` per asset on disk */
  bedtimeNeutral: "/bed-time-scene-choice-neutral.png",
} as const;
