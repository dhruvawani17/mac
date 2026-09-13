"use client";

interface NavbarProps {
  onExploreClick?: () => void;
}

export function Navbar({ onExploreClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-hairline/70 bg-white/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 shadow-sm" />
          <span className="font-bold text-[15px] tracking-tight uppercase text-ink">
            Brand My Mac
          </span>
          <span className="hidden sm:inline-block rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-ink-2">
            M5 Starlight
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-ink-2">
          <a href="#hero-3d" className="hover:text-ink transition-colors">
            Explore 3D
          </a>
          <a href="#spots" className="hover:text-ink transition-colors">
            Placements
          </a>
          <a href="#how" className="hover:text-ink transition-colors">
            How it works
          </a>
          <a href="#specs" className="hover:text-ink transition-colors">
            Specs
          </a>
          <a href="#faq" className="hover:text-ink transition-colors">
            FAQ
          </a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#spots"
            onClick={onExploreClick}
            className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-white transition-all hover:opacity-85 shadow-sm hover:shadow"
          >
            Explore Spots
          </a>
        </div>
      </div>
    </nav>
  );
}
