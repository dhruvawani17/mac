"use client";

import { memo } from "react";

export const Lighting = memo(function Lighting() {
  return (
    <>
      {/* Ambient fill for soft Apple studio baseline */}
      <ambientLight intensity={1.3} color="#fbf8f3" />

      {/* Main Studio Key Light: large warm champagne overhead key */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={2.2}
        color="#fffbf5"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={12}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
      />

      {/* Secondary Studio Fill Light: soft cool-white fill from opposite side */}
      <directionalLight
        position={[-4, 3, 2]}
        intensity={1.1}
        color="#edf2fc"
      />

      {/* Top Rim Light: catches the Starlight aluminium chamfers and hinge */}
      <directionalLight
        position={[0, 4, -4]}
        intensity={1.4}
        color="#faf7f0"
      />

      {/* Front Underside Soft Bounce: prevents harsh blacks under front lip */}
      <directionalLight
        position={[0, -2, 3]}
        intensity={0.4}
        color="#e8e4dc"
      />
    </>
  );
});
