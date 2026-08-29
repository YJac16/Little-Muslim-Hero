"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

export type ChoiceButtonProps = {
  image: string;
  label: string;
  isCorrect: boolean;
  disabled: boolean;
  waiting: boolean;
  isHighlighted: boolean;
  shouldShake: boolean;
  onResolved: (correct: boolean) => void;
};

function EarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-[#ef8b48] sm:h-9 sm:w-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 12a6 6 0 0 1 11.5-2.4c.6 1.2.5 2.7-.2 3.9L15 17.5a2.5 2.5 0 0 1-4.3-1.7V12" />
      <path d="M10.7 12v3.2a1.2 1.2 0 0 0 2.1.8l1.6-2.1" />
    </svg>
  );
}

export function ChoiceButton({
  image,
  label,
  isCorrect,
  disabled,
  waiting,
  isHighlighted,
  shouldShake,
  onResolved,
}: ChoiceButtonProps) {
  const [isActing, setIsActing] = useState(false);

  const handleTap = useCallback(() => {
    if (disabled || waiting || isActing) return;
    setIsActing(true);
    onResolved(isCorrect);
    setIsActing(false);
  }, [disabled, waiting, isActing, isCorrect, onResolved]);

  const locked = disabled || waiting || isActing;

  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={locked}
      aria-label={label}
      aria-disabled={locked}
      className={[
        /* Match landscape choice art (~4:3). Avoid h-full stretch → tall
           portrait frames that object-cover then side-crops. */
        "group relative aspect-[4/3] w-full max-h-[min(42vh,20rem)] select-none overflow-hidden rounded-[28px] border-[3px] border-white bg-[#fff8e7] shadow-softBlue transition-all duration-200 touch-manipulation",
        "sm:max-h-[min(46vh,24rem)]",
        "active:scale-[0.97]",
        isHighlighted
          ? "scale-[1.02] border-[#ffd36b] ring-4 ring-[#ffd36b]/80 ring-offset-2 ring-offset-cream shadow-glow"
          : "",
        shouldShake ? "animate-bounceRetry" : "",
        waiting
          ? "cursor-wait"
          : locked
            ? "opacity-75"
            : "hover:-translate-y-1 hover:shadow-glow",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={image}
        alt=""
        fill
        className={[
          "object-contain object-center transition-transform duration-200 group-active:scale-[0.98]",
          waiting ? "brightness-90" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        sizes="(max-width: 768px) 48vw, 42vw"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
        aria-hidden
      />
      {waiting && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#21412b]/28"
          aria-hidden
        >
          <span className="listen-lock-pulse flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-soft sm:h-16 sm:w-16">
            <EarIcon />
          </span>
        </div>
      )}
    </button>
  );
}
