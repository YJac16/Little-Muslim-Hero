import { AUDIO, IMG } from "@/lib/media";

export type LevelChoice = {
  image: string;
  audio: string;
  correct: boolean;
  /** Neutral picture description — must not reveal which answer is right. */
  label: string;
  /** CSS object-position for the square portrait crop (keeps the child in frame). */
  focus?: string;
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
  /** Optional per-moment override. Default = AUDIO.wrongCue (one file for every wrong pick). */
  wrongCue?: string;
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
        audio: AUDIO.wrongCue,
        correct: false,
        label: "Hiding under the blanket",
        focus: "50% 72%",
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
        audio: AUDIO.wrongCue,
        correct: false,
        label: "Keeping the toys",
        focus: "50% 35%",
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
        audio: AUDIO.wrongCue,
        correct: false,
        label: "Reaching for food quickly",
      },
    ],
  },
  {
    id: "helping",
    name: "Helping Time",
    scene: IMG.helpingScene,
    prompt: "Mommy needs help. What can we do?",
    narration: AUDIO.narrationHelping,
    successNarration: AUDIO.successNarrationHelping,
    successCaption: "Helping is from good character.",
    choices: [
      {
        image: IMG.helpingGood,
        audio: AUDIO.previewHelp,
        correct: true,
        label: "Helping with the chore",
      },
      {
        image: IMG.helpingNeutral,
        audio: AUDIO.wrongCue,
        correct: false,
        label: "Playing alone nearby",
        focus: "50% 55%",
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
        audio: AUDIO.wrongCue,
        correct: false,
        label: "Jumping on the bed",
        focus: "50% 22%",
      },
    ],
  },
];
