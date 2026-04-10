"use client";

type ParentMenuProps = {
  open: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onJumpToSection: (index: number) => void;
  onReset: () => void;
};

const SECTIONS = [
  "Morning",
  "Play Time",
  "Meal Time",
  "Helping Time",
  "Bedtime",
] as const;

export function ParentMenu({
  open,
  onClose,
  soundEnabled,
  onSoundToggle,
  onJumpToSection,
  onReset,
}: ParentMenuProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1b2f23]/45 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Parent menu"
    >
      <div className="glass-panel max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[28px] p-6 shadow-glow">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/70">
              Parent controls
            </p>
            <h2 className="mt-1 font-heading text-3xl text-[#25513d]">
              Parent Menu
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#2d4a32] shadow-soft active:scale-[0.98]"
          >
            Close
          </button>
        </div>

        <p className="storybook-text mb-4 text-sm font-semibold leading-6 text-[#45664e]">
          Jump to any part of the day, adjust sound, or reset the little hero
          back to the beginning.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-2">
          {SECTIONS.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => onJumpToSection(idx)}
              className="rounded-[20px] bg-white/85 px-4 py-3 text-left text-base font-semibold text-[#2d4a32] shadow-soft transition-transform active:scale-[0.99] border border-white/70"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onSoundToggle}
            className="rounded-[20px] bg-gradient-to-r from-[#dff5ff] to-[#eefcff] px-4 py-4 text-center text-base font-bold text-[#2d4a32] border border-accent/35 shadow-softBlue active:scale-[0.99]"
          >
            Sound: {soundEnabled ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="rounded-[20px] bg-gradient-to-r from-[#eef9eb] to-[#f7fff4] px-4 py-4 text-center text-base font-bold text-[#2d4a32] border border-primary/30 shadow-soft active:scale-[0.99]"
          >
            Reset progress
          </button>

          <div className="rounded-[20px] border border-dashed border-[#2d4a32]/20 bg-white/55 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2d4a32]/55">
              Coming soon
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#45664e]">
              PIN lock can be added later if you want the parent controls hidden
              more securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
