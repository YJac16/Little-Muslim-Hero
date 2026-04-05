const cache = new Map<string, HTMLAudioElement>();

export function playUrl(
  src: string,
  soundEnabled: boolean,
  volume = 1,
): Promise<void> {
  if (!soundEnabled || typeof window === "undefined") {
    return Promise.resolve();
  }
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
      resolve();
      return;
    }
    const done = () => {
      audio?.removeEventListener("ended", onEnd);
      audio?.removeEventListener("error", onEnd);
      resolve();
    };
    const onEnd = () => done();
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
