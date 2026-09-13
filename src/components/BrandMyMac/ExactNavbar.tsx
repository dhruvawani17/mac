"use client";

interface ExactNavbarProps {
  currency: "USD" | "EUR";
  onToggleCurrency: (c: "USD" | "EUR") => void;
  experienceMode?: "2d" | "3d";
  onToggleExperienceMode?: (m: "2d" | "3d") => void;
}

export function ExactNavbar({
  currency,
  onToggleCurrency,
  experienceMode,
  onToggleExperienceMode,
}: ExactNavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Laptop icon + Brand My Mac */}
        <div className="flex items-center gap-2.5">
          {/* Silver MacBook icon */}
          <div className="w-6 h-4 relative flex items-center justify-center">
            <svg viewBox="0 0 24 16" className="w-6 h-4 fill-gray-400">
              <rect x="2" y="1" width="20" height="12" rx="1.5" fill="#9ca3af" />
              <rect x="3.5" y="2.5" width="17" height="9" rx="0.5" fill="#1f2937" />
              <path d="M0 13.5C0 13.2239 0.223858 13 0.5 13H23.5C23.7761 13 24 13.2239 24 13.5V14.5C24 15.3284 23.3284 16 22.5 16H1.5C0.671573 16 0 15.3284 0 14.5V13.5Z" fill="#d1d5db" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] text-gray-950 tracking-[-0.01em]">
            Brand My Mac
          </span>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-7 text-[13.5px] font-normal text-gray-600">
          <a href="#spots" className="hover:text-gray-950 transition-colors">
            Live auction
          </a>
          <a href="/leaderboard" className="hover:text-gray-950 transition-colors">
            Leaderboard
          </a>
          <a href="#how" className="hover:text-gray-950 transition-colors">
            How it works
          </a>
          <a href="#corner" className="hover:text-gray-950 transition-colors">
            The corner
          </a>
        </div>

        {/* Right: Mode Toggle + Currency Switcher + Get a Spot */}
        <div className="flex items-center gap-2.5">
          {/* Optional 2D / 3D switcher */}
          {experienceMode && onToggleExperienceMode && (
            <button
              onClick={() => onToggleExperienceMode(experienceMode === "2d" ? "3d" : "2d")}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                experienceMode === "3d"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{experienceMode === "3d" ? "3D Active" : "3D Mode"}</span>
            </button>
          )}

          {/* Currency Toggle [ € | $ ] */}
          <div className="inline-flex rounded-full bg-gray-100/90 p-0.5 border border-gray-200/60 text-xs">
            <button
              onClick={() => onToggleCurrency("EUR")}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                currency === "EUR"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              €
            </button>
            <button
              onClick={() => onToggleCurrency("USD")}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                currency === "USD"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              $
            </button>
          </div>

          {/* Get a spot CTA */}
          <a
            href="#spots"
            className="rounded-full bg-[#111111] px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85 shadow-xs"
          >
            Get a spot
          </a>
        </div>
      </div>
    </nav>
  );
}
