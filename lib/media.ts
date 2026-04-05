/**
 * Paths under `public/` → URLs start with `/assets/...`.
 * If your filenames differ, change them only here (and keep files in
 * `public/assets/images/` and `public/assets/audio/`).
 */
export const AUDIO = {
  /** Soft looping nasheed during gameplay and celebration (not on title). */
  nasheedBackground: "/assets/audio/nasheed-bg.mp3",
  previewGood: "/assets/audio/preview-good.mp3",
  previewNeutral: "/assets/audio/preview-neutral.mp3",
  success: "/assets/audio/success.mp3",
  retry: "/assets/audio/retry.mp3",
  narrationMorning: "/assets/audio/narration-morning.mp3",
  narrationPlay: "/assets/audio/narration-play.mp3",
  narrationMeal: "/assets/audio/narration-meal.mp3",
  narrationHelping: "/assets/audio/narration-help.mp3",
  narrationBed: "/assets/audio/narration-bed.mp3",
} as const;

/** Scenes + choices use bundled SVG art; mascot may stay PNG if you add one. */
export const IMG = {
  mascot: "/assets/images/mascot.svg",
  morningScene: "/assets/images/morning-scene.svg",
  playScene: "/assets/images/play-scene.svg",
  mealScene: "/assets/images/meal-scene.svg",
  helpingScene: "/assets/images/helping-scene.svg",
  bedtimeScene: "/assets/images/bedtime-scene.svg",
  morningGood: "/assets/images/morning-good.svg",
  morningNeutral: "/assets/images/morning-neutral.svg",
  playGood: "/assets/images/play-good.svg",
  playNeutral: "/assets/images/play-neutral.svg",
  mealGood: "/assets/images/meal-good.svg",
  mealNeutral: "/assets/images/meal-neutral.svg",
  helpingGood: "/assets/images/helping-good.svg",
  helpingNeutral: "/assets/images/helping-neutral.svg",
  bedtimeGood: "/assets/images/bedtime-good.svg",
  bedtimeNeutral: "/assets/images/bedtime-neutral.svg",
} as const;
