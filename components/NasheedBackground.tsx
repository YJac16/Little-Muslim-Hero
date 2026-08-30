"use client";

import { useEffect, useRef } from "react";
import {
  BG_VOLUME_IDLE,
  getBackgroundVolume,
  subscribeBackgroundVolume,
} from "@/lib/audio";
import { AUDIO } from "@/lib/media";

type NasheedBackgroundProps = {
  soundEnabled: boolean;
  /** When false (title screen), pause and reset. */
  active: boolean;
};

function fadeTo(el: HTMLAudioElement, target: number, ms = 280) {
  const start = el.volume;
  const delta = target - start;
  if (Math.abs(delta) < 0.01) {
    el.volume = target;
    return;
  }
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / ms);
    const eased = t * (2 - t);
    try {
      el.volume = Math.max(0, Math.min(1, start + delta * eased));
    } catch {
      return;
    }
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function NasheedBackground({
  soundEnabled,
  active,
}: NasheedBackgroundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.loop = true;
    el.volume = getBackgroundVolume() || BG_VOLUME_IDLE;
  }, []);

  useEffect(() => {
    return subscribeBackgroundVolume((volume) => {
      const el = audioRef.current;
      if (!el) return;
      fadeTo(el, volume);
    });
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
