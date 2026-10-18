import { AUDIO, IMG, WRONG } from "@/lib/media";

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
  /**
   * Gentle cues for a WRONG pick in this moment, in play order: the 1st wrong pick plays
   * wrongCues[0], the 2nd wrongCues[1], ... then it loops (never the same cue twice in a row).
   * Files live in public/assets/audio/wrong/ (see WRONG in lib/media.ts).
   * "Mine" is only first at Play Time, where the word matches the picture; to use "Mine"
   * everywhere just put WRONG.mine first in every list.
   */
  wrongCues: readonly string[];
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
    wrongCues: [WRONG.oh, WRONG.boop, WRONG.sigh],
    choices: [
      {
        image: IMG.morningGood,
        audio: AUDIO.previewAlhamdulilah,
        correct: true,
        label: "Sitting up in bed",
      },
      {
        image: IMG.morningNeutral,
        audio: WRONG.oh,
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
    wrongCues: [WRONG.mine, WRONG.boop, WRONG.oh, WRONG.sigh],
    choices: [
      {
        image: IMG.playGood,
        audio: AUDIO.previewShare,
        correct: true,
        label: "Playing together",
      },
      {
        image: IMG.playNeutral,
        audio: WRONG.mine,
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
    wrongCues: [WRONG.boop, WRONG.sigh, WRONG.oh],
    choices: [
      {
        image: IMG.mealGood,
        audio: AUDIO.previewBismillah,
        correct: true,
        label: "Ready to eat with a smile",
      },
      {
        image: IMG.mealNeutral,
        audio: WRONG.boop,
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
    wrongCues: [WRONG.sigh, WRONG.oh, WRONG.boop],
    choices: [
      {
        image: IMG.helpingGood,
        audio: AUDIO.previewHelp,
        correct: true,
        label: "Helping with the chore",
      },
      {
        image: IMG.helpingNeutral,
        audio: WRONG.sigh,
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
    wrongCues: [WRONG.oh, WRONG.sigh, WRONG.boop],
    choices: [
      {
        image: IMG.bedtimeGood,
        audio: AUDIO.previewAlhamdulilah,
        correct: true,
        label: "Settling calmly for bed",
      },
      {
        image: IMG.bedtimeNeutral,
        audio: WRONG.oh,
        correct: false,
        label: "Jumping on the bed",
        focus: "50% 22%",
      },
    ],
  },
];
