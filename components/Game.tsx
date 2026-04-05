"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { levels } from "@/lib/levels";
import { AUDIO, IMG } from "@/lib/media";
import { playUrl } from "@/lib/audio";
import { Level } from "@/components/Level";
import { NasheedBackground } from "@/components/NasheedBackground";
import { ParentMenu } from "@/components/ParentMenu";

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
      await playUrl(AUDIO.previewGood, soundEnabled, 0.9);
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
      await playUrl(AUDIO.previewGood, soundEnabled, 0.9);
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

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-cream">
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
        <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-cream via-white/40 to-accent/15 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <LogoHold onHoldComplete={openParent}>
              <div className="relative h-44 w-44 sm:h-56 sm:w-56 max-w-[85vw]">
                <Image
                  src={IMG.mascot}
                  alt="Little Muslim Hero — a happy young boy in a kufi and thobe"
                  fill
                  className="object-contain object-bottom drop-shadow-lg"
                  priority
                />
              </div>
            </LogoHold>

            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                Little Muslim Hero
              </h1>
              <p className="mt-2 text-xl font-semibold text-accent sm:text-2xl">
                My Barakah Day
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void startGame()}
            className="mb-2 w-full max-w-md rounded-[24px] bg-primary py-5 text-2xl font-bold text-white shadow-soft active:scale-[0.99] min-h-[120px] border border-white/30"
          >
            Start
          </button>
        </div>
      )}

      {screen === "play" && currentLevel && (
        <div className="relative h-full">
          <div className="absolute left-2 top-[max(0.5rem,env(safe-area-inset-top))] z-10">
            <LogoHold onHoldComplete={openParent}>
              <div className="relative h-14 w-14 rounded-2xl bg-white/85 p-1 shadow-softBlue border border-primary/15">
                <Image
                  src={IMG.mascot}
                  alt=""
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </LogoHold>
          </div>
          <Level
            key={currentLevel.id}
            level={currentLevel}
            soundEnabled={soundEnabled}
            onComplete={onLevelComplete}
          />
        </div>
      )}

      {screen === "end" && (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-cream to-primary/10 px-6 text-center safe-pb pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="absolute left-2 top-[max(0.5rem,env(safe-area-inset-top))] z-10">
            <LogoHold onHoldComplete={openParent}>
              <div className="relative h-14 w-14 rounded-2xl bg-white/85 p-1 shadow-softBlue border border-primary/15">
                <Image
                  src={IMG.mascot}
                  alt=""
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </LogoHold>
          </div>

          <LogoHold onHoldComplete={openParent}>
            <div className="relative mb-8 h-40 w-40 sm:h-48 sm:w-48">
              <Image
                src={IMG.mascot}
                alt=""
                fill
                className="object-contain animate-scaleSuccess"
              />
            </div>
          </LogoHold>

          <p className="mb-10 max-w-md text-2xl font-bold leading-snug text-[#2d4a32] sm:text-3xl">
            MashaAllah! You completed your day!
          </p>

          <button
            type="button"
            onClick={() => void playAgain()}
            className="w-full max-w-md rounded-[24px] bg-accent py-5 text-xl font-bold text-white shadow-softBlue active:scale-[0.99] min-h-[120px] border border-white/30"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
