"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { playUrl } from "@/lib/audio";

export type ChoiceButtonProps = {
  image: string;
  audio: string;
  isCorrect: boolean;
  soundEnabled: boolean;
  disabled: boolean;
  isHighlighted: boolean;
  shouldShake: boolean;
  onResolved: (correct: boolean) => void;
};

export function ChoiceButton({
  image,
  audio,
  isCorrect,
  soundEnabled,
  disabled,
  isHighlighted,
  shouldShake,
  onResolved,
}: ChoiceButtonProps) {
  const [isActing, setIsActing] = useState(false);

  const handleTap = useCallback(async () => {
    if (disabled || isActing) return;
    setIsActing(true);
    await playUrl(audio, soundEnabled, 1);
    onResolved(isCorrect);
    setIsActing(false);
  }, [audio, disabled, isActing, isCorrect, onResolved, soundEnabled]);

  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={disabled || isActing}
      aria-label={isCorrect ? "Good choice" : "Try another choice"}
      className={[
        "glass-panel group relative flex min-h-[172px] select-none items-center justify-center overflow-hidden rounded-[28px] border transition-all duration-200 sm:min-h-[196px]",
        "border-white/60 px-4 py-4 shadow-softBlue active:scale-[0.985]",
        isHighlighted
          ? "scale-[1.01] ring-4 ring-[#ffd36b] ring-offset-2 ring-offset-cream"
          : "",
        shouldShake ? "animate-bounceRetry" : "",
        disabled || isActing ? "opacity-75" : "hover:-translate-y-0.5",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-x-6 top-4 h-10 rounded-full bg-gradient-to-r from-[#ffd36b]/30 to-[#6ec6ff]/25 blur-md" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/45 to-transparent" />

      <div className="relative flex w-full flex-col items-center justify-center gap-3">
        <div className="relative h-[min(23vh,180px)] w-full">
          <Image
            src={image}
            alt=""
            fill
            className="object-contain p-2 transition-transform duration-200 group-active:scale-[0.98]"
            sizes="(max-width: 640px) 90vw, 42vw"
            priority={false}
          />
        </div>
        <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#3f674a] shadow-soft">
          Tap to hear
        </div>
      </div>
    </button>
  );
}
