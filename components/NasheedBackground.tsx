"use client";

import { useEffect, useRef } from "react";
import { AUDIO } from "@/lib/media";

/** Quiet so narration and SFX stay clear. */
const BG_VOLUME = 0.26;

type NasheedBackgroundProps = {
  soundEnabled: boolean;
  /** When false (title screen), pause and reset. */
  active: boolean;
};

export function NasheedBackground({
  soundEnabled,
  active,
}: NasheedBackgroundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.loop = true;
    el.volume = BG_VOLUME;
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (!soundEnabled || !active) {
      el.pause();
      if (!active) {
        try {
          el.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
      return;
    }

    void el.play().catch(() => {
      /* autoplay blocked until gesture; retry happens on next effect/deps */
    });
  }, [soundEnabled, active]);

  return (
    <audio
      ref={audioRef}
      src={AUDIO.nasheedBackground}
      preload="auto"
      playsInline
      aria-hidden
    />
  );
}
