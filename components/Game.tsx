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

function SoundIcon({ on }: { on: boolean }) {
  return on ? (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="currentColor">
      <path d="M3 10v4h3.2L11 18.8V5.2L6.2 10H3zm11.5 2a3.5 3.5 0 0 0-1.8-3.1v6.2A3.5 3.5 0 0 0 14.5 12zm0-7.2v2.1a5.6 5.6 0 0 1 0 10.2v2.1a7.7 7.7 0 0 0 0-14.4z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="currentColor">
      <path d="M3 10v4h3.2L11 18.8V5.2L6.2 10H3zm13.3-1.1 1.4 1.4 1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4z" />
    </svg>
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
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-[max(1.5rem,env(safe-area-inset-top))]">
          <div className="flex w-full items-center justify-end">
            <button
              type="button"
              onClick={() => persistSound(!soundEnabled)}
              className="glass-panel flex h-12 w-12 items-center justify-center rounded-full text-[#28503a] shadow-softBlue touch-manipulation"
              aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            >
              <SoundIcon on={soundEnabled} />
            </button>
          </div>

          <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 short:gap-2 sm:gap-5">
            <div className="relative w-full max-w-2xl px-2 text-center sm:px-6">
              <LogoHold onHoldComplete={openParent}>
                <div className="relative mx-auto h-36 w-36 animate-floatGentle short:h-28 short:w-28 sm:h-52 sm:w-52 landscape:h-28 landscape:w-28">
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

              <div className="mt-3 space-y-1.5 short:mt-2 short:space-y-1 sm:mt-5 sm:space-y-3">
                <h1 className="storybook-text font-heading text-4xl leading-none text-[#25513d] short:text-3xl sm:text-6xl">
                  Little Muslim Hero
                </h1>
                <p className="font-heading text-xl text-[#ef8b48] short:text-lg sm:text-3xl">
                  My Barakah Day
                </p>
                <p className="storybook-text mx-auto hidden max-w-xl text-base font-semibold leading-7 text-[#3a5f47] tall:block sm:text-lg">
                  Tap through morning, play, meals, helping, and bedtime with
                  warm voices and happy choices.
                </p>
              </div>
            </div>
          </div>

          <div className="z-10 w-full max-w-md space-y-2">
            <button
              type="button"
              onClick={() => void startGame()}
              className="w-full rounded-[28px] border border-white/40 bg-gradient-to-r from-primary to-[#5bcf72] px-6 py-5 text-2xl font-bold text-white shadow-soft transition-transform active:scale-[0.99] min-h-[96px] short:min-h-[88px] sm:min-h-[108px] touch-manipulation"
            >
              Start the Day
            </button>
            <p className="text-center text-xs font-semibold text-[#44664d]/80 short:text-[10px]">
              Grown-ups: hold the hero for parent menu
            </p>
          </div>
        </div>
      )}

      {screen === "play" && currentLevel && (
        <div className="relative z-10 h-full">
          <div className="absolute inset-x-0 top-[max(0.35rem,env(safe-area-inset-top))] z-20 flex items-center justify-between px-2.5 sm:px-4">
            <LogoHold onHoldComplete={openParent}>
              <div className="glass-panel relative h-11 w-11 rounded-2xl p-1 shadow-softBlue sm:h-14 sm:w-14 landscape:h-10 landscape:w-10">
                <Image
                  src={IMG.mascot}
                  alt="Open parent menu"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </LogoHold>

            <div className="glass-panel flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-softBlue sm:gap-2 sm:px-3 sm:py-2">
              {levels.map((level, index) => {
                const active = index === levelIndex;
                const complete = index < progressCount;
                return (
                  <span
                    key={level.id}
                    className={[
                      "h-2 rounded-full transition-all",
                      active ? "w-6 bg-[#ef8b48] sm:w-7" : "w-2",
                      complete && !active ? "bg-primary" : "",
                      !complete && !active ? "bg-primary/20" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => persistSound(!soundEnabled)}
              className="glass-panel flex h-11 w-11 items-center justify-center rounded-2xl text-[#28503a] shadow-softBlue sm:h-14 sm:w-14 landscape:h-10 landscape:w-10 touch-manipulation"
              aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            >
              <SoundIcon on={soundEnabled} />
            </button>
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
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center safe-pb pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          <div className="absolute left-3 top-[max(0.5rem,env(safe-area-inset-top))] z-10">
            <LogoHold onHoldComplete={openParent}>
              <div className="glass-panel relative h-12 w-12 rounded-2xl p-1 shadow-softBlue sm:h-14 sm:w-14">
                <Image
                  src={IMG.mascot}
                  alt="Open parent menu"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </LogoHold>
          </div>

          <div className="relative w-full max-w-xl px-2">
            <LogoHold onHoldComplete={openParent}>
              <div className="relative mx-auto mb-4 h-36 w-36 animate-scaleSuccess short:mb-2 short:h-28 short:w-28 sm:mb-6 sm:h-48 sm:w-48">
                <div className="absolute inset-4 rounded-full bg-[#ffd36b]/30 blur-2xl" />
                <Image
                  src={IMG.mascotCelebrating}
                  alt="Celebrating Little Muslim Hero"
                  fill
                  className="object-contain"
                />
              </div>
            </LogoHold>

            <h2 className="storybook-text font-heading text-3xl leading-tight text-[#25513d] short:text-2xl sm:text-5xl">
              MashaAllah!
            </h2>
            <p className="storybook-text mx-auto mt-2 max-w-md text-base font-semibold leading-7 text-[#45664e] short:mt-1 short:text-sm sm:mt-4">
              You finished your Barakah Day.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void playAgain()}
            className="mt-6 w-full max-w-md rounded-[28px] border border-white/40 bg-gradient-to-r from-[#5cbff5] to-[#7ad2ff] px-6 py-5 text-xl font-bold text-white shadow-softBlue transition-transform active:scale-[0.99] min-h-[96px] short:mt-4 short:min-h-[88px] sm:mt-8 sm:min-h-[108px] touch-manipulation"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
