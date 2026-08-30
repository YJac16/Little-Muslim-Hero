const cache = new Map<string, HTMLAudioElement>();

/** Quiet ambient bed; ducked further under narration / SFX. */
export const BG_VOLUME_IDLE = 0.26;
export const BG_VOLUME_DUCKED = 0.08;

type BgListener = (volume: number) => void;

let bgTarget = BG_VOLUME_IDLE;
const bgListeners = new Set<BgListener>();
let duckDepth = 0;

function notifyBg() {
  for (const listener of bgListeners) {
    listener(bgTarget);
  }
}

export function subscribeBackgroundVolume(listener: BgListener): () => void {
  bgListeners.add(listener);
  listener(bgTarget);
  return () => {
    bgListeners.delete(listener);
  };
}

export function getBackgroundVolume(): number {
  return bgTarget;
}

function setDuckDepth(next: number) {
  duckDepth = Math.max(0, next);
  bgTarget = duckDepth > 0 ? BG_VOLUME_DUCKED : BG_VOLUME_IDLE;
  notifyBg();
}

/** Soften nasheed while voice / SFX play. Nested-safe. */
export function duckBackground(): () => void {
  setDuckDepth(duckDepth + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    setDuckDepth(duckDepth - 1);
  };
}

export function playUrl(
  src: string,
  soundEnabled: boolean,
  volume = 1,
  options?: { duck?: boolean },
): Promise<void> {
  if (!soundEnabled || typeof window === "undefined") {
    return Promise.resolve();
  }

  const shouldDuck = options?.duck !== false;
  const unduck = shouldDuck ? duckBackground() : () => undefined;

  return new Promise((resolve) => {
    let audio = cache.get(src);
    if (!audio) {
      audio = new Audio(src);
      cache.set(src, audio);
    }
    try {
      audio.volume = volume;
      audio.currentTime = 0;
    } catch {
      unduck();
      resolve();
      return;
    }

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(safety);
      audio?.removeEventListener("ended", onEnd);
      audio?.removeEventListener("error", onEnd);
      unduck();
      resolve();
    };
    const onEnd = () => done();
    const safety = window.setTimeout(done, 12_000);
    audio.addEventListener("ended", onEnd, { once: true });
    audio.addEventListener("error", onEnd, { once: true });
    void audio.play().catch(() => done());
  });
}

export function stopUrl(src: string) {
  const audio = cache.get(src);
  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      /* ignore */
    }
  }
}
