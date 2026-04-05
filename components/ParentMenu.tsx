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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Parent menu"
    >
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[24px] bg-cream p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#2d4a32]">Parent menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-[#2d4a32] active:scale-[0.98]"
          >
            Close
          </button>
        </div>

        <p className="mb-3 text-sm text-[#2d4a32]/80">
          Jump to a part of the day:
        </p>
        <div className="mb-6 grid grid-cols-1 gap-2">
          {SECTIONS.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => onJumpToSection(idx)}
              className="rounded-[18px] bg-white py-3 text-left text-base font-medium text-[#2d4a32] shadow-soft active:scale-[0.99] px-4 border border-primary/20"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onSoundToggle}
            className="rounded-[18px] bg-accent/25 py-4 text-center text-base font-semibold text-[#2d4a32] border border-accent/40 active:scale-[0.99]"
          >
            Sound: {soundEnabled ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => {
              onReset();
            }}
            className="rounded-[18px] bg-primary/20 py-4 text-center text-base font-semibold text-[#2d4a32] border border-primary/35 active:scale-[0.99]"
          >
            Reset progress
          </button>

          <div className="rounded-[18px] border border-dashed border-[#2d4a32]/25 bg-white/60 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#2d4a32]/60">
              PIN lock
            </p>
            <input
              type="password"
              inputMode="numeric"
              disabled
              placeholder="Coming soon"
              className="w-full rounded-xl border border-[#2d4a32]/15 bg-cream/80 px-3 py-2 text-sm text-[#2d4a32]/50"
              aria-disabled="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
