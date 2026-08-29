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
        "group relative min-h-[104px] w-full select-none overflow-hidden rounded-[26px] border-2 border-white/80 bg-white/70 shadow-softBlue transition-all duration-200 touch-manipulation",
        "aspect-[4/3] landscape:aspect-[5/4] landscape:min-h-[92px] sm:min-h-[116px]",
        "active:scale-[0.96]",
        isHighlighted
          ? "scale-[1.03] border-[#ffd36b] ring-4 ring-[#ffd36b]/70 ring-offset-2 ring-offset-cream shadow-glow"
          : "",
        shouldShake ? "animate-bounceRetry" : "",
        disabled || isActing
          ? "opacity-65"
          : "hover:-translate-y-1 hover:shadow-glow",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-cover object-center transition-transform duration-200 group-active:scale-[0.98]"
        sizes="(max-width: 640px) 45vw, 280px"
        priority={false}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-60"
        aria-hidden
      />
    </button>
  );
}
