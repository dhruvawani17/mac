"use client";

import { useState } from "react";
import { allSpots, SpotDefinition } from "@/data/spots";

interface SpotGridProps {
  selectedSpot: SpotDefinition | null;
  onSelectSpot: (spot: SpotDefinition) => void;
  claimedIds: Set<number>;
}

export function SpotGrid({ selectedSpot, onSelectSpot, claimedIds }: SpotGridProps) {
  const [filter, setFilter] = useState<"all" | "lid" | "inside">("all");

  const filteredSpots = allSpots.filter((s) => {
    if (filter === "lid") return s.surface === "lid";
    if (filter === "inside") return s.surface === "inside" || s.surface === "accessory";
    return true;
  });

  return (
    <section id="spots" className="scroll-mt-20 bg-surface/60 py-14 md:py-20 border-t border-hairline/70">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-2">Inventory Matrix</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
              Choose your placement
            </h2>
            <p className="text-sm text-ink-2 mt-1 max-w-lg">
              Every position is laser-mapped across the Starlight unibody chassis. Click any spot to focus the 3D camera and preview your branding.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex rounded-full bg-white p-1 shadow-sm border border-hairline shrink-0">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === "all" ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              All Spots ({allSpots.length})
            </button>
            <button
              onClick={() => setFilter("lid")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === "lid" ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              Lid Exterior (14)
            </button>
            <button
              onClick={() => setFilter("inside")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                filter === "inside" ? "bg-ink text-white" : "text-ink-2 hover:text-ink"
              }`}
            >
              Inside & Deck (10)
            </button>
          </div>
        </div>

        {/* Spot Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSpots.map((spot) => {
            const isClaimed = claimedIds.has(spot.id);
            const isSelected = selectedSpot?.id === spot.id;

            return (
              <div
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className={`group relative rounded-2xl bg-white p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                  isSelected
                    ? "border-blue ring-2 ring-blue/20 shadow-blue/10"
                    : isClaimed
                    ? "border-apple-green/40 bg-emerald-50/20"
                    : "border-hairline hover:border-ink-2/30"
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isClaimed
                          ? "bg-apple-green/20 text-emerald-700"
                          : "bg-surface text-ink group-hover:bg-ink group-hover:text-white transition-colors"
                      }`}
                    >
                      {isClaimed ? "✓" : `#${spot.id}`}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface text-ink-2">
                      {spot.surface}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isClaimed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue/10 text-blue"
                    }`}
                  >
                    {isClaimed ? "Claimed" : `$${spot.price}`}
                  </span>
                </div>

                {/* Body info */}
                <h4 className="text-sm font-bold text-ink truncate mb-1">
                  {spot.label}
                </h4>
                <p className="text-xs text-ink-2 line-clamp-1 mb-3">
                  {spot.desc}
                </p>

                {/* Footer specs */}
                <div className="flex items-center justify-between pt-3 border-t border-hairline/60 text-[11px] text-ink-2">
                  <span>Size: <strong className="text-ink">{spot.size}</strong></span>
                  <span className="text-blue group-hover:underline font-semibold flex items-center gap-1">
                    {isClaimed ? "View Sponsor ›" : "Inspect 3D ›"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
