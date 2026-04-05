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
  successNarration: string;
  choices: [LevelChoice, LevelChoice];
};

export const levels: LevelData[] = [
  {
    id: "morning",
    name: "Morning",
    scene: IMG.morningScene,
    narration: AUDIO.narrationMorning,
    successNarration: AUDIO.successNarrationMorning,
    choices: [
      {
        image: IMG.morningGood,
        audio: AUDIO.previewAlhamdulilah,
        correct: true,
      },
      {
        image: IMG.morningNeutral,
        audio: AUDIO.previewMine,
        correct: false,
      },
    ],
  },
  {
    id: "play",
    name: "Play Time",
    scene: IMG.playScene,
    narration: AUDIO.narrationPlay,
    successNarration: AUDIO.successNarrationPlay,
    choices: [
      {
        image: IMG.playGood,
        audio: AUDIO.previewShare,
        correct: true,
      },
      {
        image: IMG.playNeutral,
        audio: AUDIO.previewMine,
        correct: false,
      },
    ],
  },
  {
    id: "meal",
    name: "Meal Time",
    scene: IMG.mealScene,
    narration: AUDIO.narrationMeal,
    successNarration: AUDIO.successNarrationMeal,
    choices: [
      {
        image: IMG.mealGood,
        audio: AUDIO.previewBismillah,
        correct: true,
      },
      {
        image: IMG.mealNeutral,
        audio: AUDIO.previewMine,
        correct: false,
      },
    ],
  },
  {
    id: "helping",
    name: "Helping Time",
    scene: IMG.helpingScene,
    narration: AUDIO.narrationHelping,
    successNarration: AUDIO.successNarrationHelping,
    choices: [
      {
        image: IMG.helpingGood,
        audio: AUDIO.previewShare,
        correct: true,
      },
      {
        image: IMG.helpingNeutral,
        audio: AUDIO.previewMine,
        correct: false,
      },
    ],
  },
  {
    id: "bedtime",
    name: "Bedtime",
    scene: IMG.bedtimeScene,
    narration: AUDIO.narrationBed,
    successNarration: AUDIO.successNarrationBedtime,
    choices: [
      {
        image: IMG.bedtimeGood,
        audio: AUDIO.previewAlhamdulilah,
        correct: true,
      },
      {
        image: IMG.bedtimeNeutral,
        audio: AUDIO.previewMine,
        correct: false,
      },
    ],
  },
];
