"use client";

interface BrandCustomizerProps {
  brandText: string;
  onChangeBrandText: (text: string) => void;
  brandColor: string;
  onChangeBrandColor: (color: string) => void;
  selectedSpotLabel?: string;
}

const PRESET_BRANDS = [
  { name: "APEX AI", color: "#2563eb" },
  { name: "STRATA", color: "#0f172a" },
  { name: "LUMINARY", color: "#7c3aed" },
  { name: "VELOCE", color: "#dc2626" },
  { name: "YOUR LOGO", color: "#16a34a" },
];

const COLOR_PALETTE = [
  { label: "Ink Black", value: "#111827" },
  { label: "Electric Blue", value: "#2563eb" },
  { label: "Deep Purple", value: "#7c3aed" },
  { label: "Crimson Red", value: "#dc2626" },
  { label: "Emerald", value: "#16a34a" },
];

export function BrandCustomizer({
  brandText,
  onChangeBrandText,
  brandColor,
  onChangeBrandColor,
  selectedSpotLabel,
}: BrandCustomizerProps) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white/90 backdrop-blur-xl p-4 sm:p-5 border border-hairline/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-apple-green animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Live 3D Brand Decal Preview
          </span>
        </div>
        {selectedSpotLabel && (
          <span className="text-xs font-medium text-blue truncate max-w-[200px]">
            Target: {selectedSpotLabel}
          </span>
        )}
      </div>

      {/* Brand Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={brandText}
            onChange={(e) => onChangeBrandText(e.target.value)}
            placeholder="Type your brand name (e.g. ACME AI)..."
            className="w-full rounded-xl border border-hairline bg-surface/50 px-3.5 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-2/60 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            maxLength={24}
          />
        </div>

        {/* Color Picker Swatches */}
        <div className="flex items-center justify-center gap-1.5 px-1 py-1 rounded-xl bg-surface/60 border border-hairline/60">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.value}
              onClick={() => onChangeBrandColor(c.value)}
              title={c.label}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                brandColor === c.value ? "scale-115 ring-2 ring-blue ring-offset-2" : "hover:scale-105 opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* Preset sample brands */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-ink-2 mr-1">Presets:</span>
        {PRESET_BRANDS.map((b) => (
          <button
            key={b.name}
            onClick={() => {
              onChangeBrandText(b.name);
              onChangeBrandColor(b.color);
            }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
              brandText.toUpperCase() === b.name
                ? "bg-ink text-white"
                : "bg-surface text-ink-2 hover:text-ink hover:bg-hairline/60"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}
