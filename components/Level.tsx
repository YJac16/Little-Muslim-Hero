"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChoiceButton } from "@/components/ChoiceButton";
import { playUrl, preloadUrls, startAmbience, stopAll, stopUrl } from "@/lib/audio";
import { Burst } from "@/components/Burst";
import type { LevelData } from "@/lib/levels";
import { AMBIENCE, AMBIENCE_ENABLED, AMBIENCE_VOLUME, AUDIO, IMG } from "@/lib/media";
import { resolveWrongCues } from "@/lib/wrongCues";

type Phase = "narration" | "ready" | "success" | "retry";

type LevelProps = {
  level: LevelData;
  soundEnabled: boolean;
  levelIndex: number;
  totalLevels: number;
  /** Greeting played once before the first question (after Start). */
  introVoice?: string;
  /** Show the two pictures in swapped order (answer position varies). */
  flip?: boolean;
  onComplete: () => void;
};

function EarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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

/** Finger tapping with ripples: "your turn - tap". */
function TapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8.2 6.2a4.2 4.2 0 1 1 7.6 0" />
      <path d="M9 12V6.8a1.6 1.6 0 0 1 3.2 0V12" />
      <path d="M12.2 11.2l4.3.9a2 2 0 0 1 1.5 2.4l-.7 4.1a2 2 0 0 1-2 1.6h-3.6a2 2 0 0 1-1.6-.8L7 16.2a1.5 1.5 0 0 1 2.3-1.9L9 14.1" />
    </svg>
  );
}

export function Level({
  level,
  soundEnabled,
  levelIndex,
  totalLevels,
  introVoice,
  flip = false,
  onComplete,
}: LevelProps) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("narration");
  const [shakeWrong, setShakeWrong] = useState(false);
  const [highlightCorrect, setHighlightCorrect] = useState(false);
  const [selectedWrongIndex, setSelectedWrongIndex] = useState<number | null>(
    null,
  );
  const [burstKey, setBurstKey] = useState(0);
  const [hintPulse, setHintPulse] = useState(false);
  const [wonIndex, setWonIndex] = useState<number | null>(null);
  const hintsRef = useRef(0);
  const completedRef = useRef(false);
  const successTimerRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("narration");
  const wrongCountRef = useRef(0);
  const soundRef = useRef(soundEnabled);
  const introRef = useRef(introVoice);
  phaseRef.current = phase;
  soundRef.current = soundEnabled;

  // One run per moment: optional greeting -> question -> "your turn".
  useEffect(() => {
    completedRef.current = false;
    wrongCountRef.current = 0;
    hintsRef.current = 0;
    setHintPulse(false);
    setWonIndex(null);
    setPhase("narration");
    setShakeWrong(false);
    setHighlightCorrect(false);
    setSelectedWrongIndex(null);

    let cancelled = false;
    const intro = introRef.current;
    // Warm the wrong-answer cues so the first wrong tap answers instantly.
    preloadUrls(resolveWrongCues(level.id));

    const run = async () => {
      if (soundRef.current) {
        if (intro) await playUrl(intro, true, 1);
        if (cancelled) return;
        await playUrl(level.narration, soundRef.current, 1);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
      if (cancelled) return;
      setPhase("ready");
      void playUrl(AUDIO.cardPop, soundRef.current, 0.6, { duck: false });
    };
    void run();

    return () => {
      cancelled = true;
      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      if (intro) stopUrl(intro);
      stopUrl(level.narration);
      stopUrl(level.successNarration);
      stopUrl(level.choices[0].audio);
      stopUrl(level.choices[1].audio);
      for (const cue of resolveWrongCues(level.id)) stopUrl(cue);
      stopUrl(AUDIO.retryVoice);
    };
  }, [level]);

  // Quiet per-moment ambience bed (synthesized, ducks under voices). Off when sound is off.
  useEffect(() => {
    if (!soundEnabled || !AMBIENCE_ENABLED) return;
    return startAmbience(AMBIENCE[level.id], AMBIENCE_VOLUME);
  }, [level, soundEnabled]);

  // Switching sound off mid-moment silences it right away instead of replaying.
  useEffect(() => {
    if (!soundEnabled) stopAll();
  }, [soundEnabled]);

  // Stuck-child help: after 2 wrong picks or ~12 s of waiting, repeat the
  // question once and softly pulse the right picture (max 2 prompts per moment).
  useEffect(() => {
    if (phase !== "ready" || hintsRef.current >= 2) return;
    const afterWrong = wrongCountRef.current >= 2 && hintsRef.current === 0;
    const id = window.setTimeout(
      () => {
        if (phaseRef.current !== "ready" || completedRef.current) return;
        hintsRef.current += 1;
        setHintPulse(true);
        stopUrl(level.narration);
        void playUrl(level.narration, soundRef.current, 1);
        window.setTimeout(() => setHintPulse(false), 4200);
      },
      afterWrong ? 700 : 12_000,
    );
    return () => window.clearTimeout(id);
  }, [phase, level]);

  const hearAgain = useCallback(async () => {
    const p = phaseRef.current;
    if (p !== "ready") return;
    void playUrl(AUDIO.uiTap, soundRef.current, 0.45);
    stopUrl(level.narration);
    await playUrl(level.narration, soundRef.current, 1);
  }, [level]);

  const handleResolved = useCallback(
    async (index: number, correct: boolean) => {
      const currentPhase = phaseRef.current;
      if (currentPhase !== "ready") return;
      if (completedRef.current) return;

      const choice = level.choices[index];
      stopUrl(level.narration);
      stopUrl(AUDIO.retryVoice);
      void playUrl(AUDIO.uiTap, soundEnabled, 0.5);

      if (correct) {
        completedRef.current = true;
        setPhase("success");
        setHighlightCorrect(true);
        setSelectedWrongIndex(null);
        setBurstKey((k) => k + 1);
        setWonIndex(index);
        setHintPulse(false);
        void (async () => {
          await playUrl(choice.audio, soundEnabled, 0.95);
          void playUrl(AUDIO.twinkle, soundEnabled, 0.7, { duck: false });
          await playUrl(AUDIO.successChime, soundEnabled, 1);
          await playUrl(level.successNarration, soundEnabled, 1);
          successTimerRef.current = window.setTimeout(() => {
            successTimerRef.current = null;
            onComplete();
          }, 420);
        })();
        return;
      }

      // Wrong pick: a short, kind cue on EVERY wrong tap in every moment (set in
      // level.wrongCues, files in public/assets/audio/wrong/), plus a soft sway on
      // the tapped card. Taps re-open as soon as the cue ends; the spoken hint plays
      // over the pulse on the other picture (first miss only).
      wrongCountRef.current += 1;
      const cues = resolveWrongCues(level.id);
      const cue = cues[(wrongCountRef.current - 1) % cues.length];
      setPhase("retry");
      setHintPulse(false);
      setSelectedWrongIndex(index);
      setShakeWrong(true);
      await playUrl(cue, soundEnabled, 0.95);
      if (completedRef.current) return;
      setShakeWrong(false);
      setSelectedWrongIndex(null);
      setPhase("ready");
      setHintPulse(true);
      window.setTimeout(() => setHintPulse(false), 3600);
      if (wrongCountRef.current === 1) {
        void playUrl(AUDIO.retryVoice, soundEnabled, 0.95);
      } else {
        void playUrl(AUDIO.retry, soundEnabled, 0.8);
      }
    },
    [level, onComplete, soundEnabled],
  );

  const choiceLocked =
    phase === "narration" || phase === "success" || phase === "retry";
  const waiting = phase === "narration";
  const showSparkles = phase === "success";
  const caption =
    phase === "success"
      ? level.successCaption
      : phase === "retry"
        ? "Try the other picture."
        : level.prompt;
  const emotionSrc =
    phase === "success"
      ? IMG.mascotHappy
      : phase === "retry"
        ? IMG.mascotConfused
        : null;

  return (
    <div
      className="level-enter flex h-full max-h-[100dvh] flex-col pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-[max(4.25rem,env(safe-area-inset-top))]"
      role="region"
      aria-labelledby={`${id}-scene`}
      aria-describedby={`${id}-caption`}
    >
      <span id={`${id}-scene`} className="sr-only">
        {level.name}
      </span>

      <div className="level-body mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8">
        <div className="level-main flex min-h-0 flex-1 flex-col gap-2 sm:gap-3">
        {/* Scene — atmosphere, not the main tap target */}
        <div
          className={[
            "scene-box scene-shine relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-black/5 shadow-glow sm:rounded-[32px]",
            "max-h-[40vh] sm:max-h-[42vh] short:max-h-[34vh]",
            showSparkles ? "animate-scaleSuccess" : "",
            waiting ? "listen-pulse-ring" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={level.scene}
            alt=""
            fill
            className="scene-backdrop object-cover object-center blur-xl scale-110"
            sizes="(max-width: 1024px) 100vw, 960px"
            aria-hidden
          />
          <div className="scene-frame">
          <Image
            src={level.scene}
            alt=""
            fill
            className="scene-kenburns scene-fg object-cover object-[center_30%]"
            sizes="(max-width: 1024px) 100vw, 960px"
            priority
          />

          {wonIndex !== null && (
            <div className="scene-reveal pointer-events-none absolute inset-0">
              <Image
                src={level.choices[wonIndex].image}
                alt=""
                fill
                className="scene-fg object-cover object-[center_30%]"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>
          )}

          {emotionSrc && (
            <div
              key={emotionSrc}
              className="mascot-pop pointer-events-none absolute bottom-2.5 right-2.5 h-20 w-20 overflow-hidden rounded-full bg-white/70 shadow-glow ring-4 ring-white/90 sm:h-24 sm:w-24"
            >
              <Image
                src={emotionSrc}
                alt=""
                fill
                className="object-cover object-[center_25%]"
              />
            </div>
          )}

          {showSparkles && <Burst key={burstKey} mode="burst" count={20} />}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5 sm:p-3">
            <div className="rounded-full bg-black/45 px-3.5 py-1.5 backdrop-blur-md">
              <p className="text-sm font-bold text-white sm:text-base">
                {levelIndex + 1}/{totalLevels}
              </p>
            </div>
          </div>
        </div>

        {/* Caption + phase cue — readable without audio */}
        <div
          className={[
            "glass-panel flex items-center gap-3 rounded-[22px] px-3.5 py-3 shadow-softBlue sm:gap-4 sm:px-5 sm:py-3.5",
            waiting ? "ring-2 ring-[#ef8b48]/70" : "",
            phase === "ready" ? "ring-2 ring-primary/50" : "",
            phase === "success" ? "ring-2 ring-[#ffd36b]/80" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14",
              waiting
                ? "bg-[#ef8b48] text-white animate-softPulse"
                : phase === "success"
                  ? "bg-primary text-white"
                  : phase === "retry"
                    ? "bg-[#ef8b48]/85 text-white"
                    : "bg-primary text-white animate-softPulse",
            ].join(" ")}
            aria-hidden
          >
            {waiting ? (
              <EarIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            ) : phase === "success" ? (
              <span className="text-2xl font-black leading-none">★</span>
            ) : (
              <TapIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p
              className="text-xs font-bold uppercase tracking-wide text-[#44664d]/75 sm:text-sm"
              aria-hidden={waiting}
            >
              {waiting
                ? "Listen"
                : phase === "success"
                  ? "MashaAllah"
                  : phase === "retry"
                    ? "Try again"
                    : "Your turn"}
            </p>
            <p
              id={`${id}-caption`}
              key={caption}
              className="caption-swap storybook-text text-base font-bold leading-snug text-[#21412b] sm:text-lg md:text-xl"
            >
              {caption}
            </p>
            {waiting && (
              <div className="mt-1.5 flex items-center gap-2" aria-live="polite">
                <span className="listen-bars" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="sr-only">Please wait</span>
              </div>
            )}
          </div>
          {phase === "ready" && soundEnabled && (
            <button
              type="button"
              onClick={() => void hearAgain()}
              aria-label="Hear the question again"
              className="hear-again flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#ef8b48]/40 bg-white/90 text-[#ef8b48] shadow-soft touch-manipulation sm:h-14 sm:w-14"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12a8 8 0 1 0 2.7-6" />
                <path d="M4 4v4.5h4.5" />
                <path d="M10.5 9.5v5l4-2.5z" fill="currentColor" stroke="none" />
              </svg>
            </button>
          )}
        </div>

        </div>

        {/* Choice tray — large taps, aspect matches landscape art */}
        <div className="choice-tray level-side relative shrink-0">
          <div className="choice-grid grid grid-cols-2 items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {(flip ? [1, 0] : [0, 1]).map((idx, pos) => (
              <ChoiceButton
                key={idx}
                image={level.choices[idx].image}
                label={level.choices[idx].label}
                isCorrect={level.choices[idx].correct}
                disabled={choiceLocked && !waiting}
                waiting={waiting}
                isHighlighted={highlightCorrect && level.choices[idx].correct}
                shouldShake={shakeWrong && selectedWrongIndex === idx}
                order={pos}
                bob={phase === "ready"}
                hint={hintPulse && level.choices[idx].correct}
                focus={level.choices[idx].focus}
                onResolved={(ok) => void handleResolved(idx, ok)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
