/**
 * Paths under `public/` → URLs start with `/assets/...`.
 * If your filenames differ, change them only here (and keep files in
 * `public/assets/images/` and `public/assets/audio/`).
 */
export const AUDIO = {
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

export const IMG = {
  mascot: "/assets/images/mascot.png",
  morningScene: "/assets/images/morning-scene.png",
  playScene: "/assets/images/play-scene.png",
  mealScene: "/assets/images/meal-scene.png",
  helpingScene: "/assets/images/helping-scene.png",
  bedtimeScene: "/assets/images/bedtime-scene.png",
  morningGood: "/assets/images/morning-good.png",
  morningNeutral: "/assets/images/morning-neutral.png",
  playGood: "/assets/images/play-good.png",
  playNeutral: "/assets/images/play-neutral.png",
  mealGood: "/assets/images/meal-good.png",
  mealNeutral: "/assets/images/meal-neutral.png",
  helpingGood: "/assets/images/helping-good.png",
  helpingNeutral: "/assets/images/helping-neutral.png",
  bedtimeGood: "/assets/images/bedtime-good.png",
  bedtimeNeutral: "/assets/images/bedtime-neutral.png",
} as const;
