"use client";

import { useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { SpotDefinition } from "@/data/spots";

interface StickerSpotProps {
  spot: SpotDefinition;
  isSelected: boolean;
  onSelect: () => void;
  previewBrandText?: string;
  previewLogoUrl?: string;
  previewBrandColor?: string;
  claimedData?: { website_url: string; logo_url: string | null };
}

export function StickerSpot({
  spot,
  isSelected,
  onSelect,
  previewBrandText = "",
  previewLogoUrl = "",
  previewBrandColor = "#000000",
  claimedData,
}: StickerSpotProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);

  const [width, height] = spot.dimensions;

  // Generate dynamic vinyl sticker canvas texture
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    const dpr = 2;
    const resW = Math.max(256, Math.round(width * 600));
    const resH = Math.max(160, Math.round(height * 600));
    canvas.width = resW * dpr;
    canvas.height = resH * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.scale(dpr, dpr);

    const isClaimed = !!claimedData;
    const hasCustomBrand = isSelected && (previewBrandText.trim().length > 0 || previewLogoUrl.trim().length > 0);

    const pad = 8;
    const radius = 12;

    // Draw vinyl sticker base
    if (isClaimed || hasCustomBrand) {
      // Premium solid die-cut vinyl sticker
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(pad, pad, resW - pad * 2, resH - pad * 2, radius);
      ctx.fill();

      // Subtle vinyl inner hairline border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Content rendering
      const activeText = hasCustomBrand
        ? previewBrandText.trim()
        : claimedData?.website_url.replace(/https?:\/\//, "").split("/")[0] || "CLAIMED";

      ctx.fillStyle = hasCustomBrand ? previewBrandColor : "#171717";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Scaled font size based on dimensions
      const fontSize = Math.min(resH * 0.32, (resW / Math.max(activeText.length, 6)) * 1.5);
      ctx.font = `bold ${Math.max(14, Math.round(fontSize))}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;
      ctx.fillText(activeText, resW / 2, resH / 2);

      // Mini "VERIFIED AD" or "YOUR BRAND" watermark
      ctx.font = `600 10px -apple-system, sans-serif`;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillText(hasCustomBrand ? "PREVIEW" : "SPONSOR", resW / 2, resH - pad - 8);
    } else {
      // Available Spot: Frosted vinyl placeholder with badge
      ctx.fillStyle = isSelected
        ? "rgba(255, 255, 255, 0.45)"
        : hovered
        ? "rgba(255, 255, 255, 0.35)"
        : "rgba(255, 255, 255, 0.22)";
      ctx.beginPath();
      ctx.roundRect(pad, pad, resW - pad * 2, resH - pad * 2, radius);
      ctx.fill();

      // Dotted/dashed border
      ctx.strokeStyle = isSelected
        ? "#2563eb"
        : hovered
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      if (!isSelected) {
        ctx.setLineDash([6, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.roundRect(pad, pad, resW - pad * 2, resH - pad * 2, radius);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center pill badge
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const spotNumberText = `#${spot.id}`;
      const priceText = `$${spot.price}`;

      if (resH > 100) {
        ctx.font = `700 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
        ctx.fillStyle = isSelected ? "#2563eb" : "#171717";
        ctx.fillText(spotNumberText, resW / 2, resH / 2 - 10);

        ctx.font = `600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
        ctx.fillStyle = isSelected ? "#1d4ed8" : "rgba(23, 23, 23, 0.75)";
        ctx.fillText(priceText, resW / 2, resH / 2 + 12);
      } else {
        ctx.font = `700 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
        ctx.fillStyle = isSelected ? "#2563eb" : "#171717";
        ctx.fillText(`${spotNumberText} · ${priceText}`, resW / 2, resH / 2);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [spot, isSelected, hovered, previewBrandText, previewLogoUrl, previewBrandColor, claimedData, width, height]);

  // Smooth hover/selection micro-lift
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = isSelected ? 1.05 : hovered ? 1.03 : 1.0;
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, 14, delta);
    meshRef.current.scale.set(scaleRef.current, scaleRef.current, 1);
  });

  // Rotation: Stickers on top surfaces lie flat in the XZ plane with normals facing +Y
  const rotation: [number, number, number] = [-Math.PI / 2, 0, 0];

  return (
    <group position={spot.position}>
      <mesh
        ref={meshRef}
        rotation={rotation}
        position={[0, hovered || isSelected ? 0.003 : 0.0015, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.25}
          metalness={0.05}
          envMapIntensity={0.8}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* 3D Floating Tooltip on Hover */}
      {hovered && !isSelected && (
        <Html
          position={[0, 0.08, 0]}
          center
          distanceFactor={5}
          style={{
            pointerEvents: "none",
            transform: "translate3d(0, -10px, 0)",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="rounded-xl bg-ink/90 backdrop-blur-md px-3 py-2 text-white shadow-2xl border border-white/20 flex flex-col items-center min-w-[140px] select-none">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300">
                SPOT {spot.id < 10 ? `0${spot.id}` : spot.id}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/15 text-white/90 uppercase font-semibold">
                {spot.tier}
              </span>
            </div>
            <span className="text-xs font-semibold text-white truncate max-w-[150px]">
              {spot.label}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-white/80">
              <span className="font-bold text-emerald-400">${spot.price}</span>
              <span className="text-white/40">·</span>
              <span>{spot.size}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
