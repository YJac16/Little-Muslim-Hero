import { WRONG } from "@/lib/media";

/**
 * WRONG-PICK SOUND, PER MOMENT: the one place to change which sound a wrong pick makes.
 *
 *   WRONG.mine  the narrator's spoken "Mine."      WRONG.oh / boop / sigh  soft synthesized cues
 *
 * Each list is played in order on the 1st, 2nd, 3rd... wrong pick of that moment, then loops
 * (the same cue is never played twice in a row). Examples:
 *   "Mine" every time at Meal Time:   meal: [WRONG.mine]
 *   "Mine" first, then soft cues:      meal: [WRONG.mine, WRONG.boop, WRONG.sigh]
 *   soft cues only:                    meal: [WRONG.boop, WRONG.sigh, WRONG.oh]
 * "Mine" is first only at Play Time by default, because the word matches that picture
 * ("Keeping the toys"). To use it everywhere without editing the table, set WRONG_MODE = "mine".
 * To try it on a phone without redeploying, open the game with ?wrong=mine, ?wrong=soft or
 * ?wrong=moment (the table below).
 */
export type MomentId = "morning" | "play" | "meal" | "helping" | "bedtime";
export type WrongMode = "moment" | "mine" | "soft";

export const WRONG_MODE: WrongMode = "moment";

export const WRONG_PER_MOMENT: Record<MomentId, readonly string[]> = {
  morning: [WRONG.oh, WRONG.boop, WRONG.sigh],
  play: [WRONG.mine, WRONG.boop, WRONG.oh, WRONG.sigh],
  meal: [WRONG.boop, WRONG.sigh, WRONG.oh],
  helping: [WRONG.sigh, WRONG.oh, WRONG.boop],
  bedtime: [WRONG.oh, WRONG.sigh, WRONG.boop],
};

const SOFT_ONLY = [WRONG.oh, WRONG.boop, WRONG.sigh];

/** The cue list for a moment, honouring WRONG_MODE and the optional ?wrong= URL override. */
export function resolveWrongCues(id: MomentId): readonly string[] {
  let mode: WrongMode = WRONG_MODE;
  if (typeof window !== "undefined") {
    const q = new URLSearchParams(window.location.search).get("wrong");
    if (q === "mine" || q === "soft" || q === "moment") mode = q;
  }
  if (mode === "mine") return [WRONG.mine];
  if (mode === "soft") {
    // rotate so each moment still starts on a different cue
    const k = Object.keys(WRONG_PER_MOMENT).indexOf(id) % SOFT_ONLY.length;
    return [...SOFT_ONLY.slice(k), ...SOFT_ONLY.slice(0, k)];
  }
  return WRONG_PER_MOMENT[id];
}
