"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { SpotDefinition } from "@/data/spots";
import { Lighting } from "./Lighting";
import { MacBookModel } from "./MacBookModel";
import { LidSpots } from "./LidSpots";
import { InsideSpots } from "./InsideSpots";
import { MacBookCamera } from "./MacBookCamera";

interface ClaimedSpotData {
  id: number;
  spot_id: number;
  website_url: string;
  logo_url: string | null;
  created_at: string;
}

interface MacBookSceneProps {
  view: "lid" | "inside" | "orbit";
  selectedSpot: SpotDefinition | null;
  onSelectSpot: (spot: SpotDefinition) => void;
  claimedSpots: ClaimedSpotData[];
  previewBrandText?: string;
  previewLogoUrl?: string;
  previewBrandColor?: string;
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-20">
      <div className="w-10 h-10 border-2 border-ink/20 border-t-ink rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium tracking-tight text-ink">Preparing your MacBook…</p>
      <p className="text-xs text-ink-2 mt-1">Calibrating Starlight aluminium & 3D placement grid</p>
    </div>
  );
}

export function MacBookScene({
  view,
  selectedSpot,
  onSelectSpot,
  claimedSpots,
  previewBrandText,
  previewLogoUrl,
  previewBrandColor,
}: MacBookSceneProps) {
  // Compute hinge opening angle:
  // Closed = 0 radians
  // Open = 1.85 radians (106 degrees)
  const lidAngle = useMemo(() => {
    if (view === "lid") return 0;
    return 1.85;
  }, [view]);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] md:h-[680px] select-none">
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{
            position: [0, 2.2, 3.4],
            fov: 40,
            near: 0.1,
            far: 50,
          }}
          className="w-full h-full"
        >
          {/* Studio Lighting Setup */}
          <Lighting />

          {/* Soft Realistic Contact Shadow on Studio Table */}
          <ContactShadows
            position={[0, -0.045, 0]}
            opacity={0.45}
            scale={7.5}
            blur={1.8}
            far={3.0}
            color="#282015"
          />

          {/* Subtle Studio Environment Reflections */}
          <Environment preset="city" environmentIntensity={0.65} />

          {/* 3D Physical MacBook Air M5 */}
          <MacBookModel
            lidAngle={lidAngle}
            childrenLid={
              <LidSpots
                selectedSpotId={selectedSpot?.id ?? null}
                onSelectSpot={onSelectSpot}
                claimedSpots={claimedSpots}
                previewBrandText={previewBrandText}
                previewLogoUrl={previewLogoUrl}
                previewBrandColor={previewBrandColor}
              />
            }
            childrenBase={
              <InsideSpots
                selectedSpotId={selectedSpot?.id ?? null}
                onSelectSpot={onSelectSpot}
                claimedSpots={claimedSpots}
                previewBrandText={previewBrandText}
                previewLogoUrl={previewLogoUrl}
                previewBrandColor={previewBrandColor}
              />
            }
          />

          {/* Intelligent Camera Controller */}
          <MacBookCamera
            view={view}
            selectedSpot={selectedSpot}
            lidAngle={lidAngle}
          />
        </Canvas>
      </Suspense>

      {/* Interaction Hint Overlay at bottom center of canvas */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium text-white/90 shadow-lg border border-white/10">
        <svg className="w-3.5 h-3.5 animate-pulse text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Drag to rotate · Click any spot to preview brand & claim</span>
      </div>
    </div>
  );
}
