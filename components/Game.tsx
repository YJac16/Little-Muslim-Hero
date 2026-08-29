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

type Progress = {
  screen: Screen;
  levelIndex: number;
};

const SOUND_KEY = "lmh-sound-enabled";
const PROGRESS_KEY = "lmh-progress";
const PARENT_TAP_COUNT = 5;
const PARENT_TAP_WINDOW_MS = 1500;

function isScreen(value: unknown): value is Screen {
  return value === "start" || value === "play" || value === "end";
}

function readProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { screen?: unknown; levelIndex?: unknown };
    if (!isScreen(parsed.screen)) return null;
    const levelIndex = Number(parsed.levelIndex);
    if (
      !Number.isInteger(levelIndex) ||
      levelIndex < 0 ||
      levelIndex >= levels.length
    ) {
      return parsed.screen === "end"
        ? { screen: "end", levelIndex: levels.length - 1 }
        : null;
    }
    return { screen: parsed.screen, levelIndex };
  } catch {
    return null;
  }
}

function writeProgress(progress: Progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}

function LogoMultiTap({
  children,
  onUnlock,
}: {
  children: ReactNode;
  onUnlock: () => void;
}) {
  const tapsRef = useRef(0);
  const windowStartRef = useRef(0);
  const [tapProgress, setTapProgress] = useState(0);

  const onTap = useCallback(() => {
    const now = Date.now();
    if (now - windowStartRef.current > PARENT_TAP_WINDOW_MS) {
      tapsRef.current = 0;
      windowStartRef.current = now;
    }
    tapsRef.current += 1;
    const count = tapsRef.current;
    if (count >= PARENT_TAP_COUNT) {
      tapsRef.current = 0;
      windowStartRef.current = 0;
      setTapProgress(0);
      onUnlock();
      return;
    }
    setTapProgress(count);
  }, [onUnlock]);

  useEffect(() => {
    if (tapProgress === 0) return;
    const id = window.setTimeout(() => {
      tapsRef.current = 0;
      windowStartRef.current = 0;
      setTapProgress(0);
    }, PARENT_TAP_WINDOW_MS);
    return () => window.clearTimeout(id);
  }, [tapProgress]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onTap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTap();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Tap 5 times for parent menu"
      className="relative touch-manipulation cursor-pointer select-none"
    >
      {children}
      {tapProgress > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-2 flex justify-center gap-1"
          aria-hidden
        >
          {Array.from({ length: PARENT_TAP_COUNT }, (_, i) => (
            <span
              key={i}
              className={[
                "h-1.5 w-1.5 rounded-full transition-colors",
                i < tapProgress ? "bg-[#ef8b48]" : "bg-[#44664d]/25",
              ].join(" ")}
            />
          ))}
        </div>
      )}
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
  const [ready, setReady] = useState(false);
  const startingRef = useRef(false);
  const celebratedRef = useRef(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(SOUND_KEY);
      if (v === "0") setSoundEnabled(false);
    } catch {
      /* ignore */
    }
    const saved = readProgress();
    if (saved) {
      setScreen(saved.screen);
      setLevelIndex(saved.levelIndex);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (screen === "start") {
      clearProgress();
      celebratedRef.current = false;
      return;
    }
    writeProgress({ screen, levelIndex });
  }, [ready, screen, levelIndex]);

  useEffect(() => {
    if (screen !== "end" || celebratedRef.current) return;
    celebratedRef.current = true;
    void playUrl(AUDIO.celebrate, soundEnabled, 0.9);
  }, [screen, soundEnabled]);

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

  const startGame = useCallback(() => {
    if (startingRef.current) return;
    startingRef.current = true;
    void playUrl(AUDIO.uiStart, soundEnabled, 0.85);
    setLevelIndex(0);
    setScreen("play");
    startingRef.current = false;
  }, [soundEnabled]);

  const playAgain = useCallback(() => {
    if (startingRef.current) return;
    startingRef.current = true;
    void playUrl(AUDIO.uiStart, soundEnabled, 0.85);
    celebratedRef.current = false;
    setLevelIndex(0);
    setScreen("play");
    startingRef.current = false;
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
    clearProgress();
    celebratedRef.current = false;
    setLevelIndex(0);
    setScreen("start");
    setParentOpen(false);
  }, []);

  const currentLevel = levels[levelIndex];
  const progressCount = screen === "end" ? levels.length : levelIndex;

  if (!ready) {
    return (
      <div
        className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-cream"
        aria-busy="true"
      />
    );
  }

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
        <div className="relative z-10 flex h-full flex-col">
          {/* Full-bleed atmospheric hero plane (kids-app pattern) */}
          <div className="pointer-events-none absolute inset-0">
            <Image
              src={IMG.morningScene}
              alt=""
              fill
              className="object-cover object-center opacity-55"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff8e7]/35 via-[#fff8e7]/72 to-[#fff8e7]" />
          </div>

          <div className="relative flex h-full flex-col items-center justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-[max(1.5rem,env(safe-area-inset-top))]">
            <div className="flex w-full items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  void playUrl(AUDIO.uiTap, soundEnabled, 0.45);
                  persistSound(!soundEnabled);
                }}
                className="glass-panel flex h-12 w-12 items-center justify-center rounded-full text-[#28503a] shadow-softBlue touch-manipulation"
                aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
              >
                <SoundIcon on={soundEnabled} />
              </button>
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 short:gap-2 sm:gap-5">
              <div className="hero-enter relative w-full max-w-2xl px-2 text-center sm:px-6">
                <LogoMultiTap onUnlock={openParent}>
                  <div className="relative mx-auto h-40 w-40 animate-floatGentle short:h-28 short:w-28 sm:h-56 sm:w-56 landscape:h-28 landscape:w-28">
                    <div className="absolute inset-2 rounded-full bg-[#ffd36b]/35 blur-2xl" />
                    <Image
                      src={IMG.mascot}
                      alt="Little Muslim Hero mascot"
                      fill
                      className="object-contain object-bottom drop-shadow-lg"
                      priority
                    />
                  </div>
                </LogoMultiTap>

                <div className="mt-3 space-y-1.5 short:mt-2 short:space-y-1 sm:mt-5 sm:space-y-2">
                  <h1 className="storybook-text font-heading text-[2.65rem] leading-[0.95] text-[#25513d] short:text-3xl sm:text-6xl">
                    Little Muslim Hero
                  </h1>
                  <p className="font-heading text-xl text-[#ef8b48] short:text-lg sm:text-3xl">
                    My Barakah Day
                  </p>
                  <p className="storybook-text mx-auto max-w-md text-sm font-semibold leading-6 text-[#3a5f47]/90 short:hidden sm:text-base">
                    Pictures and warm voices — no reading needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="z-10 w-full max-w-md space-y-2 hero-enter-delay">
              <button
                type="button"
                onClick={startGame}
                className="cta-glow relative z-20 w-full rounded-[28px] border border-white/50 bg-gradient-to-r from-primary to-[#5bcf72] px-6 py-5 text-2xl font-bold text-white shadow-soft transition-transform active:scale-[0.99] min-h-[96px] short:min-h-[88px] sm:min-h-[108px] touch-manipulation"
              >
                Start the Day
              </button>
              <p className="text-center text-xs font-semibold text-[#44664d]/80 short:text-[10px]">
                Grown-ups: tap the hero 5 times for parent menu
              </p>
            </div>
          </div>
        </div>
      )}

      {screen === "play" && currentLevel && (
        <div className="relative z-10 h-full">
          <div className="absolute inset-x-0 top-[max(0.35rem,env(safe-area-inset-top))] z-20 flex items-center justify-between px-2.5 sm:px-4">
            <LogoMultiTap onUnlock={openParent}>
              <div className="glass-panel relative h-12 w-12 overflow-hidden rounded-2xl shadow-softBlue sm:h-14 sm:w-14 landscape:h-12 landscape:w-12">
                <Image
                  src={IMG.mascot}
                  alt="Open parent menu"
                  fill
                  className="object-cover object-center"
                  sizes="56px"
                />
              </div>
            </LogoMultiTap>

            <div className="glass-panel flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-softBlue sm:gap-2 sm:px-3 sm:py-2">
              {levels.map((level, index) => {
                const active = index === levelIndex;
                const complete = index < progressCount;
                return (
                  <span
                    key={level.id}
                    className={[
                      "relative flex h-2.5 items-center justify-center rounded-full transition-all",
                      active ? "w-7 bg-[#ef8b48] sm:w-8" : "w-2.5",
                      complete && !active ? "w-2.5 bg-primary" : "",
                      !complete && !active ? "bg-primary/20" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden
                  >
                    {complete && !active && (
                      <span className="absolute inset-0 m-auto h-1 w-1 rounded-full bg-white/90" />
                    )}
                  </span>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                void playUrl(AUDIO.uiTap, soundEnabled, 0.45);
                persistSound(!soundEnabled);
              }}
              className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl text-[#28503a] shadow-softBlue sm:h-14 sm:w-14 landscape:h-12 landscape:w-12 touch-manipulation"
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
        <div className="relative z-10 flex h-full flex-col">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src={IMG.mascotRewardScene}
              alt=""
              fill
              className="object-cover object-center opacity-70"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff8e7]/25 via-[#fff8e7]/75 to-[#fff8e7]" />
          </div>

          <div className="relative flex h-full flex-col items-center justify-center px-5 text-center safe-pb pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
            <div className="absolute left-3 top-[max(0.5rem,env(safe-area-inset-top))] z-10">
              <LogoMultiTap onUnlock={openParent}>
                <div className="glass-panel relative h-12 w-12 overflow-hidden rounded-2xl shadow-softBlue sm:h-14 sm:w-14">
                  <Image
                    src={IMG.mascot}
                    alt="Open parent menu"
                    fill
                    className="object-cover object-center"
                    sizes="56px"
                  />
                </div>
              </LogoMultiTap>
            </div>

            <div className="hero-enter relative w-full max-w-xl px-2">
              <LogoMultiTap onUnlock={openParent}>
                <div className="relative mx-auto mb-4 h-36 w-36 animate-scaleSuccess short:mb-2 short:h-28 short:w-28 sm:mb-6 sm:h-48 sm:w-48">
                  <div className="absolute inset-4 rounded-full bg-[#ffd36b]/35 blur-2xl" />
                  <Image
                    src={IMG.mascotCelebrating}
                    alt="Celebrating Little Muslim Hero"
                    fill
                    className="object-contain"
                  />
                </div>
              </LogoMultiTap>

              <h2 className="storybook-text font-heading text-3xl leading-tight text-[#25513d] short:text-2xl sm:text-5xl">
                MashaAllah!
              </h2>
              <p className="storybook-text mx-auto mt-2 max-w-md text-base font-semibold leading-7 text-[#45664e] short:mt-1 short:text-sm sm:mt-3">
                You finished your Barakah Day.
              </p>

              {/* Completed path — Duolingo-style moment trail */}
              <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-1.5 short:mt-2 sm:mt-5">
                {levels.map((level) => (
                  <div
                    key={level.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-soft sm:h-9 sm:w-9">
                      ✓
                    </span>
                    <span className="hidden text-[10px] font-bold uppercase tracking-wide text-[#45664e]/80 tall:block">
                      {level.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={playAgain}
              className="cta-glow relative z-20 hero-enter-delay mt-6 w-full max-w-md rounded-[28px] border border-white/50 bg-gradient-to-r from-[#5cbff5] to-[#7ad2ff] px-6 py-5 text-xl font-bold text-white shadow-softBlue transition-transform active:scale-[0.99] min-h-[96px] short:mt-4 short:min-h-[88px] sm:mt-8 sm:min-h-[108px] touch-manipulation"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
