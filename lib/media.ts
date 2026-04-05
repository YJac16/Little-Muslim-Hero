/**
 * Paths = files in `public/` (URL starts with `/`).
 * Filenames match what you added at repo root / `public/assets/`.
 */
export const AUDIO = {
  nasheedBackground: "/assets/audio/nasheed-bg.mp3",
  /** Start / Play Again tap */
  uiStart: "/Preview-Bismillah.mp3",
  narrationMorning:
    "/Morning-Intro-Good-morning-little-hero-When-we-wake-up-what-do-we-say.mp3",
  narrationPlay:
    "/Play-Intro-Your-friend-wants-to-play-What-should-we-do.mp3",
  narrationMeal: "/Meal-Intro-Before-we-eat-what-do-we-say.mp3",
  narrationHelping:
    "/Helping-Intro-Mommy-needs-help-What-can-we-do.mp3",
  narrationBed: "/Bedtime-Intro-Before-we-sleep-we-make-our-dua.mp3",
  previewAlhamdulilah: "/Preview-Alhamdulilah.mp3",
  previewBismillah: "/Preview-Bismillah.mp3",
  previewMine: "/Preview-Mine.mp3",
  previewShare: "/Preview-Share.mp3",
  successChime: "/soft-sparkle-chime-for-correct-choices.mp3",
  retry: "/Gentle-pop-for-retry.mp3",
  successNarrationMorning:
    "/Success-MashaAllah-Allah-loves-when-we-remember-Him.mp3",
  successNarrationPlay: "/Success-Sharing-makes-hearts-happy.mp3",
  successNarrationMeal: "/Success-Bismillah-brings-barakah.mp3",
  successNarrationHelping:
    "/Success-Helping-is-from-good-character.mp3",
  successNarrationBedtime: "/Success-Sleep-peacefully-little-hero.mp3",
} as const;

export const IMG = {
  mascot: "/mascot.png",
  mascotCelebrating: "/mascot-celebrating-pose.png",
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
