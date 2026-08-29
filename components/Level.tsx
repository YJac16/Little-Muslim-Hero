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
import { AUDIO, IMG } from "@/lib/media";

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
      stopUrl(level.narration);
      stopUrl(level.successNarration);
      stopUrl(level.choices[0].audio);
      stopUrl(level.choices[1].audio);
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
      void playUrl(AUDIO.uiTap, soundEnabled, 0.55);
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

      const choice = level.choices[index];
      stopUrl(level.narration);
      void playUrl(AUDIO.uiTap, soundEnabled, 0.5);

      if (correct) {
        completedRef.current = true;
        setPhase("success");
        setHighlightCorrect(true);
        setSelectedWrongIndex(null);
        void (async () => {
          await playUrl(choice.audio, soundEnabled, 0.95);
          await playUrl(AUDIO.successChime, soundEnabled, 1);
          await playUrl(level.successNarration, soundEnabled, 1);
          successTimerRef.current = window.setTimeout(() => {
            successTimerRef.current = null;
            onComplete();
          }, 420);
        })();
        return;
      }

      setPhase("retry");
      setSelectedWrongIndex(index);
      setShakeWrong(true);
      await playUrl(choice.audio, soundEnabled, 0.95);
      await playUrl(AUDIO.retry, soundEnabled, 1);
      await new Promise((resolve) => setTimeout(resolve, 360));
      setShakeWrong(false);
      setSelectedWrongIndex(null);
      setPhase("ready");
    },
    [level, onComplete, soundEnabled],
  );

  const choiceLocked =
    phase === "narration" || phase === "success" || phase === "retry";
  const showSparkles = phase === "success";
  const listening = phase === "narration";
  const emotionSrc =
    phase === "success"
      ? IMG.mascotHappy
      : phase === "retry"
        ? IMG.mascotConfused
        : null;

  return (
    <div
      className="flex h-full max-h-[100dvh] flex-col pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(3.75rem,env(safe-area-inset-top))] landscape:pt-[max(3.25rem,env(safe-area-inset-top))]"
      role="region"
      aria-labelledby={`${id}-scene`}
    >
      <span id={`${id}-scene`} className="sr-only">
        {level.name}
      </span>

      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-2 px-2 sm:gap-3 sm:px-4 landscape:flex-row landscape:items-stretch landscape:gap-3 landscape:px-3">
        <div
          className={[
            "relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-black/5 shadow-glow sm:rounded-[32px]",
            "landscape:min-h-0 landscape:basis-[58%]",
            "short:min-h-[38%] short:flex-[0.9]",
            showSparkles ? "animate-scaleSuccess" : "",
            listening ? "listen-pulse-ring" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={level.scene}
            alt={`${level.name} story scene`}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5 sm:p-3">
            <div className="rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {levelIndex + 1}/{totalLevels}
              </p>
            </div>
            <div
              className={[
                "rounded-full px-3 py-1.5 backdrop-blur-md",
                listening
                  ? "bg-[#ef8b48]/90 animate-softPulse"
                  : phase === "success"
                    ? "bg-primary/90"
                    : "bg-black/40",
              ].join(" ")}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#fff8e7]">
                {phaseBadge[phase]}
              </p>
            </div>
          </div>

          {listening && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 backdrop-blur-md">
                <span className="listen-bars" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="text-xs font-bold text-white">Listen…</span>
              </div>
            </div>
          )}

          {emotionSrc && (
            <div className="pointer-events-none absolute bottom-2 right-2 h-16 w-16 animate-scaleSuccess sm:h-20 sm:w-20 landscape:h-14 landscape:w-14">
              <Image
                src={emotionSrc}
                alt=""
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          )}

          {showSparkles && <SparkleOverlay />}
        </div>

        {/* Duolingo-style bottom choice tray */}
        <div
          className={[
            "choice-tray shrink-0 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:pb-2",
            "landscape:basis-[42%] landscape:content-center landscape:self-center landscape:pb-0",
            listening ? "opacity-55" : "opacity-100",
            "transition-opacity duration-300",
          ].join(" ")}
        >
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 landscape:gap-2.5">
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
