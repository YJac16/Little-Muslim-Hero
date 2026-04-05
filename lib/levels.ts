import { AUDIO, IMG } from "@/lib/media";

export type LevelChoice = {
  image: string;
  audio: string;
  correct: boolean;
};

export type LevelData = {
  id: "morning" | "play" | "meal" | "helping" | "bedtime";
  name: string;
  scene: string;
  narration: string;
  choices: [LevelChoice, LevelChoice];
};

/** Filenames are defined in `lib/media.ts` (maps to `public/assets/`). */
export const levels: LevelData[] = [
  {
    id: "morning",
    name: "Morning",
    scene: IMG.morningScene,
    narration: AUDIO.narrationMorning,
    choices: [
      {
        image: IMG.morningGood,
        audio: AUDIO.previewGood,
        correct: true,
      },
      {
        image: IMG.morningNeutral,
        audio: AUDIO.previewNeutral,
        correct: false,
      },
    ],
  },
  {
    id: "play",
    name: "Play Time",
    scene: IMG.playScene,
    narration: AUDIO.narrationPlay,
    choices: [
      {
        image: IMG.playGood,
        audio: AUDIO.previewGood,
        correct: true,
      },
      {
        image: IMG.playNeutral,
        audio: AUDIO.previewNeutral,
        correct: false,
      },
    ],
  },
  {
    id: "meal",
    name: "Meal Time",
    scene: IMG.mealScene,
    narration: AUDIO.narrationMeal,
    choices: [
      {
        image: IMG.mealGood,
        audio: AUDIO.previewGood,
        correct: true,
      },
      {
        image: IMG.mealNeutral,
        audio: AUDIO.previewNeutral,
        correct: false,
      },
    ],
  },
  {
    id: "helping",
    name: "Helping Time",
    scene: IMG.helpingScene,
    narration: AUDIO.narrationHelping,
    choices: [
      {
        image: IMG.helpingGood,
        audio: AUDIO.previewGood,
        correct: true,
      },
      {
        image: IMG.helpingNeutral,
        audio: AUDIO.previewNeutral,
        correct: false,
      },
    ],
  },
  {
    id: "bedtime",
    name: "Bedtime",
    scene: IMG.bedtimeScene,
    narration: AUDIO.narrationBed,
    choices: [
      {
        image: IMG.bedtimeGood,
        audio: AUDIO.previewGood,
        correct: true,
      },
      {
        image: IMG.bedtimeNeutral,
        audio: AUDIO.previewNeutral,
        correct: false,
      },
    ],
  },
];
