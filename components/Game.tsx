"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Level } from "@/components/Level";
import { NasheedBackground } from "@/components/NasheedBackground";
import { ParentMenu } from "@/components/ParentMenu";
import { playUrl } from "@/lib/audio";
import { levels } from "@/lib/levels";
import { AUDIO, IMG } from "@/lib/media";

type Screen = "start" | "play" | "end";

const SOUND_KEY = "lmh-sound-enabled";
const LOGO_HOLD_MS = 3000;

function LogoHold({
  children,
  onHoldComplete,
}: {
  children: ReactNode;
  onHoldComplete: () => void;
}) {
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const onPointerDown = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onHoldComplete();
    }, LOGO_HOLD_MS);
  }, [clearTimer, onHoldComplete]);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      onContextMenu={(e) => e.preventDefault()}
      className="touch-manipulation cursor-pointer select-none"
    >
      {children}
    </div>
  );
}

function AmbientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ambient-orb animate-drift left-[-3rem] top-[10%] h-40 w-40 bg-[#ffd36b]/40" />
      <div className="ambient-orb animate-drift right-[-2rem] top-[22%] h-44 w-44 bg-[#6ec6ff]/30 [animation-delay:0.8s]" />
      <div className="ambient-orb animate-drift bottom-[12%] left-[10%] h-32 w-32 bg-[#ffc7b8]/30 [animation-delay:1.2s]" />
    </div>
  );
}

export function Game() {
  const [screen, setScreen] = useState<Screen>("start");
  const [levelIndex, setLevelIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [parentOpen, setParentOpen] = useState(false);
  const startingRef = useRef(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(SOUND_KEY);
      if (v === "0") setSoundEnabled(false);
    } catch {
      /* ignore */
    }
  }, []);

  const persistSound = useCallback((next: boolean) => {
    setSoundEnabled(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const openParent = useCallback(() => setParentOpen(true), []);
  const closeParent = useCallback(() => setParentOpen(false), []);

  const startGame = useCallback(async () => {
    if (startingRef.current) return;
    startingRef.current = true;
    try {
      await playUrl(AUDIO.uiStart, soundEnabled, 0.9);
      setLevelIndex(0);
      setScreen("play");
    } finally {
      startingRef.current = false;
    }
  }, [soundEnabled]);

  const playAgain = useCallback(async () => {
    if (startingRef.current) return;
    startingRef.current = true;
    try {
      await playUrl(AUDIO.uiStart, soundEnabled, 0.9);
      setLevelIndex(0);
      setScreen("play");
    } finally {
      startingRef.current = false;
    }
  }, [soundEnabled]);

  const onLevelComplete = useCallback(() => {
    setLevelIndex((current) => {
      if (current >= levels.length - 1) {
        queueMicrotask(() => setScreen("end"));
        return current;
      }
      return current + 1;
    });
  }, []);

  const jumpToSection = useCallback((index: number) => {
    const i = Math.max(0, Math.min(levels.length - 1, index));
    setLevelIndex(i);
    setScreen("play");
    setParentOpen(false);
  }, []);

  const resetProgress = useCallback(() => {
    setLevelIndex(0);
    setScreen("start");
    setParentOpen(false);
  }, []);

  const currentLevel = levels[levelIndex];
  const progressCount = screen === "end" ? levels.length : levelIndex;

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-cream">
      <AmbientBackdrop />
      <NasheedBackground
        soundEnabled={soundEnabled}
        active={screen === "play" || screen === "end"}
      />
      <ParentMenu
        open={parentOpen}
        onClose={closeParent}
        soundEnabled={soundEnabled}
        onSoundToggle={() => persistSound(!soundEnabled)}
        onJumpToSection={jumpToSection}
        onReset={resetProgress}
      />

      {screen === "start" && (
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6">
          <div className="flex w-full items-center justify-between">
            <div className="rounded-full bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary shadow-softBlue">
              Little hearts, big barakah
            </div>
            <button
              type="button"
              onClick={() => persistSound(!soundEnabled)}
              className="glass-panel rounded-full px-4 py-2 text-sm font-semibold text-[#28503a] shadow-softBlue"
              aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            >
              {soundEnabled ? "Sound On" : "Sound Off"}
            </button>
          </div>

          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-[32px] px-6 py-8 shadow-glow sm:px-10">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fff2c8]/80 to-transparent" />
              <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-[#6ec6ff]/20 blur-xl" />
              <div className="absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-[#ffd36b]/25 blur-xl" />

              <div className="relative flex flex-col items-center gap-5 text-center">
                <LogoHold onHoldComplete={openParent}>
                  <div className="relative h-44 w-44 animate-floatGentle sm:h-56 sm:w-56">
                    <div className="absolute inset-4 rounded-full bg-[#ffd36b]/25 blur-2xl" />
                    <Image
                      src={IMG.mascot}
                      alt="Little Muslim Hero mascot"
                      fill
                      className="object-contain object-bottom drop-shadow-lg"
                      priority
                    />
                  </div>
                </LogoHold>

                <div className="space-y-3">
                  <p className="font-heading text-sm uppercase tracking-[0.3em] text-primary/80">
                    A gentle Islamic routine game
                  </p>
                  <h1 className="storybook-text font-heading text-4xl leading-none text-[#25513d] sm:text-6xl">
                    Little Muslim Hero
                  </h1>
                  <p className="font-heading text-2xl text-[#ef8b48] sm:text-3xl">
                    My Barakah Day
                  </p>
                  <p className="storybook-text mx-auto max-w-xl text-base font-semibold leading-7 text-[#3a5f47] sm:text-lg">
                    Tap through morning, play, meals, helping, and bedtime with
                    warm voices, happy choices, and a softer storybook feel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full max-w-md space-y-3">
            <button
              type="button"
              onClick={() => void startGame()}
              className="w-full rounded-[28px] bg-gradient-to-r from-primary to-[#5bcf72] px-6 py-5 text-2xl font-bold text-white shadow-soft transition-transform active:scale-[0.99] min-h-[108px] border border-white/40"
            >
              Start the Day
            </button>
            <p className="text-center text-sm font-semibold text-[#44664d]">
              Press and hold the mascot for the parent menu
            </p>
          </div>
        </div>
      )}

      {screen === "play" && currentLevel && (
        <div className="relative z-10 h-full">
          <div className="absolute inset-x-0 top-[max(0.5rem,env(safe-area-inset-top))] z-10 flex items-start justify-between px-3 sm:px-4">
            <LogoHold onHoldComplete={openParent}>
              <div className="glass-panel relative h-14 w-14 rounded-2xl p-1 shadow-softBlue">
                <Image
                  src={IMG.mascot}
                  alt="Open parent menu"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </LogoHold>

            <div className="glass-panel rounded-full px-4 py-2 shadow-softBlue">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-primary/80">
                Progress
              </p>
              <div className="mt-2 flex items-center gap-2">
                {levels.map((level, index) => {
                  const active = index === levelIndex;
                  const complete = index < progressCount;
                  return (
                    <span
                      key={level.id}
                      className={[
                        "h-2.5 rounded-full transition-all",
                        active ? "w-9 bg-[#ef8b48]" : "w-2.5",
                        complete && !active ? "bg-primary" : "",
                        !complete && !active ? "bg-primary/20" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <Level
            key={currentLevel.id}
            level={currentLevel}
            soundEnabled={soundEnabled}
            levelIndex={levelIndex}
            totalLevels={levels.length}
            onComplete={onLevelComplete}
          />
        </div>
      )}

      {screen === "end" && (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center safe-pb pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="absolute left-3 top-[max(0.5rem,env(safe-area-inset-top))] z-10">
            <LogoHold onHoldComplete={openParent}>
              <div className="glass-panel relative h-14 w-14 rounded-2xl p-1 shadow-softBlue">
                <Image
                  src={IMG.mascot}
                  alt="Open parent menu"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </LogoHold>
          </div>

          <div className="glass-panel relative w-full max-w-xl rounded-[32px] px-6 py-10 shadow-glow">
            <div className="absolute inset-x-0 top-0 h-24 rounded-t-[32px] bg-gradient-to-b from-[#fff0bb]/80 to-transparent" />

            <LogoHold onHoldComplete={openParent}>
              <div className="relative mx-auto mb-6 h-40 w-40 sm:h-48 sm:w-48">
                <div className="absolute inset-4 rounded-full bg-[#ffd36b]/30 blur-2xl" />
                <Image
                  src={IMG.mascotCelebrating}
                  alt="Celebrating Little Muslim Hero"
                  fill
                  className="object-contain animate-scaleSuccess"
                />
              </div>
            </LogoHold>

            <p className="font-heading text-sm uppercase tracking-[0.26em] text-primary/80">
              Day complete
            </p>
            <h2 className="storybook-text mt-3 font-heading text-4xl leading-tight text-[#25513d] sm:text-5xl">
              MashaAllah, you completed your day!
            </h2>
            <p className="storybook-text mx-auto mt-4 max-w-md text-base font-semibold leading-7 text-[#45664e]">
              The little hero remembered Allah, shared with kindness, and ended
              the day with calm hearts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void playAgain()}
            className="mt-8 w-full max-w-md rounded-[28px] bg-gradient-to-r from-[#5cbff5] to-[#7ad2ff] px-6 py-5 text-xl font-bold text-white shadow-softBlue transition-transform active:scale-[0.99] min-h-[108px] border border-white/40"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
