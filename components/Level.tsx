"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ChoiceButton } from "@/components/ChoiceButton";
import { playUrl, stopUrl } from "@/lib/audio";
import type { LevelData } from "@/lib/levels";
import { AUDIO } from "@/lib/media";

type Phase = "narration" | "ready" | "success" | "retry";

type LevelProps = {
  level: LevelData;
  soundEnabled: boolean;
  levelIndex: number;
  totalLevels: number;
  onComplete: () => void;
};

const phaseBadge: Record<Phase, string> = {
  narration: "Listen",
  ready: "Choose",
  success: "MashaAllah",
  retry: "Try again",
};

export function Level({
  level,
  soundEnabled,
  levelIndex,
  totalLevels,
  onComplete,
}: LevelProps) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("narration");
  const [shakeWrong, setShakeWrong] = useState(false);
  const [highlightCorrect, setHighlightCorrect] = useState(false);
  const [selectedWrongIndex, setSelectedWrongIndex] = useState<number | null>(
    null,
  );
  const completedRef = useRef(false);
  const narrPlayedRef = useRef(false);
  const successTimerRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("narration");
  phaseRef.current = phase;

  useEffect(() => {
    narrPlayedRef.current = false;
    completedRef.current = false;
    setPhase("narration");
    setShakeWrong(false);
    setHighlightCorrect(false);
    setSelectedWrongIndex(null);
    return () => {
      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [level]);

  useEffect(() => {
    if (narrPlayedRef.current) return;
    narrPlayedRef.current = true;

    let cancelled = false;

    const run = async () => {
      if (soundEnabled) {
        await playUrl(level.narration, soundEnabled, 1);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      if (cancelled) return;
      setPhase("ready");
    };

    void run();
    return () => {
      cancelled = true;
      stopUrl(level.narration);
      narrPlayedRef.current = false;
    };
  }, [level, soundEnabled]);

  const handleResolved = useCallback(
    async (index: number, correct: boolean) => {
      const currentPhase = phaseRef.current;
      if (currentPhase !== "ready" && currentPhase !== "retry") return;
      if (completedRef.current) return;

      if (correct) {
        completedRef.current = true;
        stopUrl(level.narration);
        setPhase("success");
        setHighlightCorrect(true);
        setSelectedWrongIndex(null);
        void (async () => {
          await playUrl(AUDIO.successChime, soundEnabled, 1);
          successTimerRef.current = window.setTimeout(() => {
            successTimerRef.current = null;
            onComplete();
          }, 700);
        })();
        return;
      }

      stopUrl(level.narration);
      setPhase("retry");
      setSelectedWrongIndex(index);
      setShakeWrong(true);
      await playUrl(AUDIO.retry, soundEnabled, 1);
      await new Promise((resolve) => setTimeout(resolve, 480));
      setShakeWrong(false);
      setSelectedWrongIndex(null);
      setPhase("ready");
    },
    [level.narration, onComplete, soundEnabled],
  );

  const choiceLocked =
    phase === "narration" || phase === "success" || phase === "retry";
  const showSparkles = phase === "success";

  return (
    <div
      className="flex h-full max-h-[100dvh] flex-col pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(4.25rem,env(safe-area-inset-top))]"
      role="region"
      aria-labelledby={`${id}-scene`}
    >
      <span id={`${id}-scene`} className="sr-only">
        {level.name}
      </span>

      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-2 px-2 sm:gap-3 sm:px-4">
        <div
          className={[
            "relative min-h-0 flex-1 overflow-hidden rounded-[24px] bg-black/5 shadow-glow sm:rounded-[28px]",
            showSparkles ? "animate-scaleSuccess" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={level.scene}
            alt={`${level.name} story scene`}
            fill
            className="object-cover object-center sm:object-contain"
            sizes="100vw"
            priority
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5 sm:p-3">
            <div className="rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {level.name}
                <span className="ml-2 opacity-80">
                  {levelIndex + 1}/{totalLevels}
                </span>
              </p>
            </div>
            <div className="rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe7a3]">
                {phaseBadge[phase]}
              </p>
            </div>
          </div>

          {showSparkles && <SparkleOverlay />}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 pb-1 sm:gap-3 sm:pb-2">
          <ChoiceButton
            image={level.choices[0].image}
            isCorrect={level.choices[0].correct}
            disabled={choiceLocked}
            isHighlighted={highlightCorrect && level.choices[0].correct}
            shouldShake={shakeWrong && selectedWrongIndex === 0}
            onResolved={(ok) => void handleResolved(0, ok)}
          />
          <ChoiceButton
            image={level.choices[1].image}
            isCorrect={level.choices[1].correct}
            disabled={choiceLocked}
            isHighlighted={highlightCorrect && level.choices[1].correct}
            shouldShake={shakeWrong && selectedWrongIndex === 1}
            onResolved={(ok) => void handleResolved(1, ok)}
          />
        </div>
      </div>
    </div>
  );
}

function SparkleOverlay() {
  const dots = Array.from({ length: 14 }, (_, i) => ({
    key: i,
    left: `${8 + ((i * 17) % 84)}%`,
    top: `${10 + ((i * 23) % 75)}%`,
    tx: `${-30 + (i % 5) * 15}px`,
    ty: `${-40 + (i % 4) * 12}px`,
    delay: `${i * 45}ms`,
  }));

  return (
    <div
      className="pointer-events-none absolute inset-0 animate-sparkle bg-gradient-to-b from-accent/20 to-transparent"
      aria-hidden
    >
      {dots.map((dot) => (
        <span
          key={dot.key}
          className="sparkle-particle"
          style={
            {
              left: dot.left,
              top: dot.top,
              "--tx": dot.tx,
              "--ty": dot.ty,
              animationDelay: dot.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
