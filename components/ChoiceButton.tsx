"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

export type ChoiceButtonProps = {
  image: string;
  isCorrect: boolean;
  disabled: boolean;
  isHighlighted: boolean;
  shouldShake: boolean;
  onResolved: (correct: boolean) => void;
};

export function ChoiceButton({
  image,
  isCorrect,
  disabled,
  isHighlighted,
  shouldShake,
  onResolved,
}: ChoiceButtonProps) {
  const [isActing, setIsActing] = useState(false);

  const handleTap = useCallback(() => {
    if (disabled || isActing) return;
    setIsActing(true);
    onResolved(isCorrect);
    setIsActing(false);
  }, [disabled, isActing, isCorrect, onResolved]);

  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={disabled || isActing}
      aria-label={isCorrect ? "Good choice" : "Try another choice"}
      className={[
        "group relative aspect-[4/3] w-full select-none overflow-hidden rounded-[22px] border border-white/70 bg-white/55 shadow-softBlue transition-all duration-200",
        "active:scale-[0.97]",
        isHighlighted
          ? "scale-[1.02] ring-4 ring-[#ffd36b] ring-offset-2 ring-offset-cream"
          : "",
        shouldShake ? "animate-bounceRetry" : "",
        disabled || isActing ? "opacity-70" : "hover:-translate-y-0.5",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-contain p-1.5 transition-transform duration-200 group-active:scale-[0.98] sm:p-2"
        sizes="(max-width: 640px) 45vw, 280px"
        priority={false}
      />
    </button>
  );
}
