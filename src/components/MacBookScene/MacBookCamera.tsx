"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { SpotDefinition } from "@/data/spots";

interface MacBookCameraProps {
  view: "lid" | "inside" | "orbit";
  selectedSpot: SpotDefinition | null;
  lidAngle: number; // 0 (closed) or ~1.85 (open)
}

export function MacBookCamera({ view, selectedSpot }: MacBookCameraProps) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera, pointer } = useThree();

  // Target camera state
  const targetCamPos = useRef(new THREE.Vector3(0, 2.2, 3.4));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.1, 0));

  // Determine target camera framing based on view & spot selection
  useEffect(() => {
    if (selectedSpot) {
      // Focus Camera on Selected Spot
      if (selectedSpot.surface === "lid") {
        // Close-up on lid spot
        const [sx, , sz] = selectedSpot.position;
        // In lid coordinates
        targetLookAt.current.set(sx * 0.7, 0.2, sz - 0.9);
        targetCamPos.current.set(sx * 0.5, 1.6, sz + 0.8);
      } else if (selectedSpot.surface === "inside") {
        // Close-up on palm rest deck
        const [sx, , sz] = selectedSpot.position;
        targetLookAt.current.set(sx * 0.8, 0.1, sz * 0.8);
        targetCamPos.current.set(sx * 0.6, 1.5, sz + 1.2);
      } else {
        // Accessory close-up
        const [sx, , sz] = selectedSpot.position;
        targetLookAt.current.set(sx, 0.1, sz);
        targetCamPos.current.set(sx, 1.4, sz + 1.2);
      }
    } else {
      // Standard Product Framing
      if (view === "lid") {
        // Overview of closed exterior lid: crisp top-angled product hero
        targetLookAt.current.set(0, 0.05, 0.1);
        targetCamPos.current.set(0, 2.4, 3.1);
      } else if (view === "inside") {
        // Dynamic three-quarter view showing screen + keyboard + palm rests
        targetLookAt.current.set(0, 0.45, -0.1);
        targetCamPos.current.set(0, 2.1, 3.3);
      } else {
        // 360 Orbit default position
        targetLookAt.current.set(0, 0.2, 0);
        targetCamPos.current.set(1.8, 1.9, 3.2);
      }
    }
  }, [view, selectedSpot]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Apply gentle mouse parallax only when not actively dragging in orbit mode
    const parallaxX = view === "orbit" || selectedSpot ? 0 : pointer.x * 0.18;
    const parallaxY = view === "orbit" || selectedSpot ? 0 : -pointer.y * 0.12;

    const desiredPos = targetCamPos.current.clone().add(new THREE.Vector3(parallaxX, parallaxY, 0));

    // Smoothly interpolate camera position and controls target
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPos.x, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPos.y, 5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPos.z, 5, delta);

    controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetLookAt.current.x, 5, delta);
    controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetLookAt.current.y, 5, delta);
    controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetLookAt.current.z, 5, delta);

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={1.2}
      maxDistance={6.0}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2 - 0.05} // Keep above studio floor
      dampingFactor={0.05}
      rotateSpeed={0.7}
      enabled={!selectedSpot} // Allow full orbit drag when no spot is locked
    />
  );
}
