"use client";

interface ModeSwitchProps {
  view: "lid" | "inside" | "orbit";
  onChangeView: (view: "lid" | "inside" | "orbit") => void;
  claimedCount?: number;
}

export function ModeSwitch({ view, onChangeView, claimedCount = 0 }: ModeSwitchProps) {
  return (
    <div className="inline-flex items-center rounded-full bg-surface p-1 shadow-inner border border-hairline/80 backdrop-blur-md">
      <button
        onClick={() => onChangeView("lid")}
        className={`relative flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-medium transition-all cursor-pointer ${
          view === "lid"
            ? "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            : "text-ink-2 hover:text-ink"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
        <span>Lid Exterior</span>
      </button>

      <button
        onClick={() => onChangeView("inside")}
        className={`relative flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-medium transition-all cursor-pointer ${
          view === "inside"
            ? "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            : "text-ink-2 hover:text-ink"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-blue" />
        <span>Inside Deck</span>
        {claimedCount > 0 && (
          <span className="ml-1 rounded-full bg-blue px-1.5 py-0.2 text-[10px] font-bold text-white">
            {claimedCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onChangeView("orbit")}
        className={`relative flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-medium transition-all cursor-pointer ${
          view === "orbit"
            ? "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            : "text-ink-2 hover:text-ink"
        }`}
      >
        <svg className="w-3.5 h-3.5 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>360° Studio</span>
      </button>
    </div>
  );
}
