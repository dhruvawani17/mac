"use client";

import { insideSpots, SpotDefinition } from "@/data/spots";
import { StickerSpot } from "./StickerSpot";

interface InsideSpotsProps {
  selectedSpotId: number | null;
  onSelectSpot: (spot: SpotDefinition) => void;
  claimedSpots: { spot_id: number; website_url: string; logo_url: string | null }[];
  previewBrandText?: string;
  previewLogoUrl?: string;
  previewBrandColor?: string;
}

export function InsideSpots({
  selectedSpotId,
  onSelectSpot,
  claimedSpots,
  previewBrandText,
  previewLogoUrl,
  previewBrandColor,
}: InsideSpotsProps) {
  return (
    <group name="InsideSpotsGroup">
      {insideSpots.map((spot) => {
        const claim = claimedSpots.find((c) => c.spot_id === spot.id);
        const isSelected = selectedSpotId === spot.id;

        return (
          <StickerSpot
            key={spot.id}
            spot={spot}
            isSelected={isSelected}
            onSelect={() => onSelectSpot(spot)}
            claimedData={claim}
            previewBrandText={previewBrandText}
            previewLogoUrl={previewLogoUrl}
            previewBrandColor={previewBrandColor}
          />
        );
      })}
    </group>
  );
}
