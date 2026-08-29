import { AUDIO, IMG } from "@/lib/media";

export type LevelChoice = {
  image: string;
  audio: string;
  correct: boolean;
  /** Neutral picture description — must not reveal which answer is right. */
  label: string;
};

export type LevelData = {
  id: "morning" | "play" | "meal" | "helping" | "bedtime";
  name: string;
  scene: string;
  /** Parent-facing prompt shown when audio is off or as a caption. */
  prompt: string;
  narration: string;
  successNarration: string;
  successCaption: string;
  choices: [LevelChoice, LevelChoice];
};

export const levels: LevelData[] = [
  {
    id: "morning",
    name: "Morning",
    scene: IMG.morningScene,
    prompt: "When we wake up, what do we say?",
    narration: AUDIO.narrationMorning,
    successNarration: AUDIO.successNarrationMorning,
    successCaption: "MashaAllah — remembering Allah is beautiful.",
    choices: [
      {
        image: IMG.morningGood,
        audio: AUDIO.previewAlhamdulilah,
        correct: true,
        label: "Sitting up in bed",
      },
      {
        image: IMG.morningNeutral,
        audio: AUDIO.previewMine,
        correct: false,
        label: "Hiding under the blanket",
      },
    ],
  },
  {
    id: "play",
    name: "Play Time",
    scene: IMG.playScene,
    prompt: "Your friend wants to play. What should we do?",
    narration: AUDIO.narrationPlay,
    successNarration: AUDIO.successNarrationPlay,
    successCaption: "Sharing makes hearts happy.",
    choices: [
      {
        image: IMG.playGood,
        audio: AUDIO.previewShare,
        correct: true,
        label: "Playing together",
      },
      {
        image: IMG.playNeutral,
        audio: AUDIO.previewMine,
        correct: false,
        label: "Keeping the toys",
      },
    ],
  },
  {
    id: "meal",
    name: "Meal Time",
    scene: IMG.mealScene,
    prompt: "Before we eat, what do we say?",
    narration: AUDIO.narrationMeal,
    successNarration: AUDIO.successNarrationMeal,
    successCaption: "Bismillah brings barakah.",
    choices: [
      {
        image: IMG.mealGood,
        audio: AUDIO.previewBismillah,
        correct: true,
        label: "Ready to eat with a smile",
      },
      {
        image: IMG.mealNeutral,
        audio: AUDIO.previewMine,
        correct: false,
        label: "Reaching for food quickly",
      },
    ],
  },
  {
    id: "helping",
    name: "Helping Time",
    scene: IMG.helpingScene,
    prompt: "Someone needs help. What can we do?",
    narration: AUDIO.narrationHelping,
    successNarration: AUDIO.successNarrationHelping,
    successCaption: "Helping is from good character.",
    choices: [
      {
        image: IMG.helpingGood,
        audio: AUDIO.previewShare,
        correct: true,
        label: "Helping with the chore",
      },
      {
        image: IMG.helpingNeutral,
        audio: AUDIO.previewMine,
        correct: false,
        label: "Playing alone nearby",
      },
    ],
  },
  {
    id: "bedtime",
    name: "Bedtime",
    scene: IMG.bedtimeScene,
    prompt: "Before we sleep, we make our dua.",
    narration: AUDIO.narrationBed,
    successNarration: AUDIO.successNarrationBedtime,
    successCaption: "Sleep peacefully, little hero.",
    choices: [
      {
        image: IMG.bedtimeGood,
        audio: AUDIO.previewAlhamdulilah,
        correct: true,
        label: "Settling calmly for bed",
      },
      {
        image: IMG.bedtimeNeutral,
        audio: AUDIO.previewMine,
        correct: false,
        label: "Jumping on the bed",
      },
    ],
  },
];
