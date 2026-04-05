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
        "relative flex min-h-[120px] flex-1 select-none items-center justify-center overflow-hidden rounded-[22px] border-4 transition-transform duration-200",
        "border-primary/35 bg-white/90 shadow-soft active:scale-[0.98]",
        isHighlighted ? "ring-4 ring-accent ring-offset-2 ring-offset-cream scale-[1.02]" : "",
        shouldShake ? "animate-bounceRetry" : "",
        disabled || isActing ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative h-[min(28vh,200px)] w-full">
        <Image
          src={image}
          alt=""
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 45vw, 200px"
          priority={false}
        />
      </div>
    </button>
  );
}
