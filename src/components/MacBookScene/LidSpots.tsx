"use client";

import { lidSpots, SpotDefinition } from "@/data/spots";
import { StickerSpot } from "./StickerSpot";

interface LidSpotsProps {
  selectedSpotId: number | null;
  onSelectSpot: (spot: SpotDefinition) => void;
  claimedSpots: { spot_id: number; website_url: string; logo_url: string | null }[];
  previewBrandText?: string;
  previewLogoUrl?: string;
  previewBrandColor?: string;
}

export function LidSpots({
  selectedSpotId,
  onSelectSpot,
  claimedSpots,
  previewBrandText,
  previewLogoUrl,
  previewBrandColor,
}: LidSpotsProps) {
  return (
    <group name="LidSpotsGroup">
      {lidSpots.map((spot) => {
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
