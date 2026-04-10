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

const phaseCopy: Record<Phase, { badge: string; hint: string }> = {
  narration: {
    badge: "Listen",
    hint: "A warm voice is guiding the little hero right now.",
  },
  ready: {
    badge: "Choose",
    hint: "Tap the picture that shows the best adab for this moment.",
  },
  success: {
    badge: "MashaAllah",
    hint: "Beautiful choice. Let the celebration play before the next scene.",
  },
  retry: {
    badge: "Try again",
    hint: "A gentle pop means we can look again and choose the kinder action.",
  },
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
          if (level.successNarration) {
            await playUrl(level.successNarration, soundEnabled, 1);
          }
          successTimerRef.current = window.setTimeout(() => {
            successTimerRef.current = null;
            onComplete();
          }, 900);
        })();
        return;
      }

      stopUrl(level.narration);
      setPhase("retry");
      setSelectedWrongIndex(index);
      setShakeWrong(true);
      await playUrl(AUDIO.retry, soundEnabled, 1);
      await new Promise((resolve) => setTimeout(resolve, 520));
      setShakeWrong(false);
      setSelectedWrongIndex(null);
      setPhase("ready");
    },
    [level.narration, level.successNarration, onComplete, soundEnabled],
  );

  const choiceLocked =
    phase === "narration" || phase === "success" || phase === "retry";
  const showSparkles = phase === "success";
  const copy = phaseCopy[phase];

  return (
    <div
      className="flex h-full max-h-[100dvh] flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(4.6rem,env(safe-area-inset-top))] sm:px-4"
      role="region"
      aria-labelledby={`${id}-scene`}
    >
      <span id={`${id}-scene`} className="sr-only">
        {level.name}
      </span>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3">
        <div className="glass-panel rounded-[26px] px-4 py-3 shadow-softBlue sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/70">
                Scene {levelIndex + 1} of {totalLevels}
              </p>
              <h2 className="font-heading text-2xl text-[#24513c] sm:text-3xl">
                {level.name}
              </h2>
            </div>
            <div className="rounded-full bg-white/75 px-4 py-2 text-right shadow-soft">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ef8b48]">
                {copy.badge}
              </p>
              <p className="storybook-text mt-1 max-w-[18rem] text-sm font-semibold text-[#45664e]">
                {copy.hint}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <div
            className={[
              "glass-panel relative mx-auto flex h-full max-h-[54vh] w-full max-w-5xl overflow-hidden rounded-[30px] p-3 shadow-glow",
              showSparkles ? "animate-scaleSuccess" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#6ec6ff]/10 to-transparent" />
            <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/55">
              <Image
                src={level.scene}
                alt={`${level.name} story scene`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {showSparkles && <SparkleOverlay />}
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 pb-1 sm:grid-cols-2">
          <ChoiceButton
            image={level.choices[0].image}
            audio={level.choices[0].audio}
            isCorrect={level.choices[0].correct}
            soundEnabled={soundEnabled}
            disabled={choiceLocked}
            isHighlighted={highlightCorrect && level.choices[0].correct}
            shouldShake={shakeWrong && selectedWrongIndex === 0}
            onResolved={(ok) => void handleResolved(0, ok)}
          />
          <ChoiceButton
            image={level.choices[1].image}
            audio={level.choices[1].audio}
            isCorrect={level.choices[1].correct}
            soundEnabled={soundEnabled}
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
      className="pointer-events-none absolute inset-0 animate-sparkle rounded-[24px] bg-gradient-to-b from-accent/20 to-transparent"
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
