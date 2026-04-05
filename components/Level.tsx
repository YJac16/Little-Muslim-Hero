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
import type { LevelData } from "@/lib/levels";
import { AUDIO } from "@/lib/media";
import { playUrl, stopUrl } from "@/lib/audio";
import { ChoiceButton } from "@/components/ChoiceButton";

type Phase = "narration" | "ready" | "success" | "retry";

type LevelProps = {
  level: LevelData;
  soundEnabled: boolean;
  onComplete: () => void;
};

export function Level({ level, soundEnabled, onComplete }: LevelProps) {
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
        await new Promise((r) => setTimeout(r, 600));
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
      const p = phaseRef.current;
      if (p !== "ready" && p !== "retry") return;
      if (completedRef.current) return;

      if (correct) {
        completedRef.current = true;
        stopUrl(level.narration);
        setPhase("success");
        setHighlightCorrect(true);
        setSelectedWrongIndex(null);
        void playUrl(AUDIO.success, soundEnabled, 1);
        successTimerRef.current = window.setTimeout(() => {
          successTimerRef.current = null;
          onComplete();
        }, 2000);
        return;
      }

      stopUrl(level.narration);
      setPhase("retry");
      setSelectedWrongIndex(index);
      setShakeWrong(true);
      await playUrl(AUDIO.retry, soundEnabled, 1);
      await new Promise((r) => setTimeout(r, 520));
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
      className="flex h-full max-h-[100dvh] flex-col bg-cream safe-pb"
      role="region"
      aria-labelledby={`${id}-scene`}
    >
      <span id={`${id}-scene`} className="sr-only">
        {level.name}
      </span>

      <div className="relative min-h-0 flex-[0.6] w-full px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div
          className={`relative mx-auto h-full max-h-[56vh] w-full max-w-lg overflow-hidden rounded-[24px] bg-white/50 shadow-softBlue ${
            showSparkles ? "animate-scaleSuccess" : ""
          }`}
        >
          <Image
            src={level.scene}
            alt=""
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
          {showSparkles && <SparkleOverlay />}
        </div>
      </div>

      <div className="flex min-h-0 flex-[0.4] flex-col justify-end gap-3 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex w-full max-w-lg mx-auto gap-3">
          <ChoiceButton
            image={level.choices[0].image}
            audio={level.choices[0].audio}
            isCorrect={level.choices[0].correct}
            soundEnabled={soundEnabled}
            disabled={choiceLocked}
            isHighlighted={
              highlightCorrect && level.choices[0].correct === true
            }
            shouldShake={shakeWrong && selectedWrongIndex === 0}
            onResolved={(ok) => void handleResolved(0, ok)}
          />
          <ChoiceButton
            image={level.choices[1].image}
            audio={level.choices[1].audio}
            isCorrect={level.choices[1].correct}
            soundEnabled={soundEnabled}
            disabled={choiceLocked}
            isHighlighted={
              highlightCorrect && level.choices[1].correct === true
            }
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
      {dots.map((d) => (
        <span
          key={d.key}
          className="sparkle-particle"
          style={
            {
              left: d.left,
              top: d.top,
              "--tx": d.tx,
              "--ty": d.ty,
              animationDelay: d.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
