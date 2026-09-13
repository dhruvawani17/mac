"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface MacBookModelProps {
  lidAngle: number; // in radians: 0 is closed, ~1.85 is ~106° open
  childrenLid?: React.ReactNode;
  childrenBase?: React.ReactNode;
}

// Generate rounded rectangle shape helper
function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

// Generate Apple Logo Shape helper
function createAppleLogoShape() {
  const shape = new THREE.Shape();
  // Normalized classic Apple silhouette curve points
  shape.moveTo(0, -0.14);
  shape.bezierCurveTo(-0.06, -0.14, -0.11, -0.09, -0.11, -0.01);
  shape.bezierCurveTo(-0.11, 0.07, -0.05, 0.13, 0.0, 0.13);
  shape.bezierCurveTo(0.04, 0.13, 0.07, 0.11, 0.10, 0.11);
  shape.bezierCurveTo(0.13, 0.11, 0.15, 0.13, 0.19, 0.13);
  shape.bezierCurveTo(0.24, 0.13, 0.29, 0.06, 0.31, -0.01);
  shape.bezierCurveTo(0.25, -0.04, 0.22, -0.10, 0.22, -0.16);
  shape.bezierCurveTo(0.22, -0.22, 0.26, -0.27, 0.30, -0.29);
  shape.bezierCurveTo(0.28, -0.34, 0.23, -0.39, 0.17, -0.39);
  shape.bezierCurveTo(0.12, -0.39, 0.09, -0.36, 0.06, -0.36);
  shape.bezierCurveTo(0.03, -0.36, 0.0, -0.39, -0.05, -0.39);
  shape.bezierCurveTo(-0.12, -0.39, -0.18, -0.33, -0.21, -0.26);
  shape.bezierCurveTo(-0.25, -0.16, -0.23, -0.03, -0.18, 0.06);
  shape.bezierCurveTo(-0.14, 0.13, -0.09, 0.18, -0.03, 0.18);
  shape.bezierCurveTo(0.02, 0.18, 0.05, 0.15, 0.09, 0.15);
  shape.bezierCurveTo(0.12, 0.15, 0.15, 0.18, 0.20, 0.18);
  return shape;
}

export function MacBookModel({ lidAngle, childrenLid, childrenBase }: MacBookModelProps) {
  const lidGroupRef = useRef<THREE.Group>(null);
  const currentLidAngleRef = useRef(lidAngle);

  // Proportions: 13-inch MacBook Air M5
  const width = 3.04;
  const depth = 2.15;
  const cornerRadius = 0.12;

  // Starlight Aluminium PBR Material (Champagne-gold warm metallic, never orange or yellow)
  const starlightMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ebe5dc"),
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 1.2,
    });
  }, []);

  // Mirrored Apple Logo Material (Polished mirror specular chrome)
  const chromeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f8f8fb"),
      metalness: 0.98,
      roughness: 0.04,
      envMapIntensity: 2.0,
    });
  }, []);

  // Dark Anodized keyboard tray & bezels
  const darkTrayMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#161618"),
      metalness: 0.6,
      roughness: 0.5,
    });
  }, []);

  // Keycap Material
  const keycapMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1d"),
      metalness: 0.2,
      roughness: 0.4,
    });
  }, []);

  // Trackpad Glass Material (Matte Starlight etched glass)
  const trackpadMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ded8cf"),
      metalness: 0.5,
      roughness: 0.22,
      envMapIntensity: 0.9,
    });
  }, []);

  // Rubber Feet Material
  const rubberFeetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#202022"),
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  // Screen Bezel Material
  const bezelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0d0d0f"),
      roughness: 0.35,
      metalness: 0.2,
    });
  }, []);

  // Procedural Liquid Retina macOS Screen Texture
  const screenTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 660;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Premium macOS Starlight dynamic wallpaper gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 660);
    grad.addColorStop(0, "#1c1824");
    grad.addColorStop(0.35, "#2a2238");
    grad.addColorStop(0.65, "#4c3954");
    grad.addColorStop(0.85, "#85606d");
    grad.addColorStop(1, "#cfa28a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 660);

    // Glowing organic M5 ribbon waves
    ctx.save();
    ctx.filter = "blur(30px)";
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.bezierCurveTo(300, 200, 700, 600, 1024, 300);
    ctx.lineTo(1024, 660);
    ctx.lineTo(0, 660);
    ctx.closePath();
    ctx.fillStyle = "rgba(220, 175, 140, 0.4)";
    ctx.fill();
    ctx.restore();

    // macOS Menu Bar
    ctx.fillStyle = "rgba(25, 20, 30, 0.7)";
    ctx.fillRect(0, 0, 1024, 28);

    // Apple menu logo
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillText("  Finder  File  Edit  View  Go  Window  Help", 16, 19);

    // Menu bar right items: Control Center, Wifi, Battery, Time
    ctx.font = "12px -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.textAlign = "right";
    ctx.fillText("M5 · 100%  Sat 10:42 AM", 1008, 19);

    // macOS Dock at bottom
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.beginPath();
    ctx.roundRect(312, 606, 400, 46, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dock App Icons
    const appColors = [
      "#007aff", "#34c759", "#ff9500", "#af52de",
      "#ff2d55", "#5856d6", "#5ac8fa", "#ffcc00"
    ];
    appColors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.roundRect(330 + idx * 46, 614, 30, 30, 8);
      ctx.fill();
    });
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const screenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.1,
      metalness: 0.05,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: screenTexture,
      emissiveIntensity: 0.65,
    });
  }, [screenTexture]);

  // Rounded base shape & geometry
  const baseShape = useMemo(() => createRoundedRectShape(width, depth, cornerRadius), [width, depth, cornerRadius]);
  const baseGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.065,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
  }, [baseShape]);

  // Rounded lid shape & geometry
  const lidShape = useMemo(() => createRoundedRectShape(width, depth, cornerRadius), [width, depth, cornerRadius]);
  const lidGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(lidShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
  }, [lidShape]);

  // Smooth hinge animation loop
  useFrame((_, delta) => {
    if (!lidGroupRef.current) return;
    currentLidAngleRef.current = THREE.MathUtils.damp(
      currentLidAngleRef.current,
      lidAngle,
      8,
      delta
    );
    lidGroupRef.current.rotation.x = currentLidAngleRef.current;
  });

  // Individual keyboard keys generation
  const keyboardKeys = useMemo(() => {
    const keys: { x: number; z: number; w: number; d: number }[] = [];
    const rows = 6;
    const keyDepth = 0.125;
    const gap = 0.022;
    const startZ = -0.76;

    // Row 0: Function row (Esc + F1-F12 + Touch ID)
    const fKeyWidth = 0.138;
    for (let i = 0; i < 14; i++) {
      keys.push({
        x: -1.18 + i * (fKeyWidth + gap),
        z: startZ,
        w: fKeyWidth,
        d: 0.08,
      });
    }

    // Row 1: Number row (14 keys)
    for (let i = 0; i < 14; i++) {
      const isEnd = i === 13;
      keys.push({
        x: -1.18 + i * (0.145 + gap),
        z: startZ + 0.12,
        w: isEnd ? 0.22 : 0.145,
        d: keyDepth,
      });
    }

    // Row 2: QWERTY row (14 keys)
    for (let i = 0; i < 14; i++) {
      const isTab = i === 0;
      keys.push({
        x: -1.18 + i * (0.145 + gap),
        z: startZ + 0.12 + (keyDepth + gap),
        w: isTab ? 0.2 : 0.145,
        d: keyDepth,
      });
    }

    // Row 3: ASDF row (13 keys)
    for (let i = 0; i < 13; i++) {
      const isReturn = i === 12;
      keys.push({
        x: -1.18 + i * (0.155 + gap),
        z: startZ + 0.12 + (keyDepth + gap) * 2,
        w: isReturn ? 0.24 : 0.155,
        d: keyDepth,
      });
    }

    // Row 4: ZXCV row (12 keys)
    for (let i = 0; i < 12; i++) {
      const isShift = i === 0 || i === 11;
      keys.push({
        x: -1.18 + i * (0.17 + gap),
        z: startZ + 0.12 + (keyDepth + gap) * 3,
        w: isShift ? 0.26 : 0.15,
        d: keyDepth,
      });
    }

    // Row 5: Modifier & Space bar row
    // Left modifiers
    keys.push({ x: -1.15, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.16, d: keyDepth });
    keys.push({ x: -0.96, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.16, d: keyDepth });
    keys.push({ x: -0.77, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.16, d: keyDepth });
    keys.push({ x: -0.55, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.21, d: keyDepth });
    // Space bar
    keys.push({ x: 0.0, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.78, d: keyDepth });
    // Right modifiers & inverted-T arrows
    keys.push({ x: 0.55, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.21, d: keyDepth });
    keys.push({ x: 0.77, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.16, d: keyDepth });
    keys.push({ x: 1.0, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.12, d: keyDepth });
    keys.push({ x: 1.15, z: startZ + 0.12 + (keyDepth + gap) * 4, w: 0.12, d: keyDepth });

    return keys;
  }, []);

  return (
    <group name="MacBookAirM5Root">
      {/* ========================================================================= */}
      {/* 1. BASE CHASSIS (KEYBOARD DECK, PORTS, TRACKPAD, FEET)                   */}
      {/* ========================================================================= */}
      <group name="BaseChassisGroup" position={[0, 0, 0]}>
        {/* Main Aluminium Unibody Base */}
        <mesh
          geometry={baseGeometry}
          material={starlightMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.035, 0]}
          castShadow
          receiveShadow
        />

        {/* Recessed Keyboard Tray (dark matte well) */}
        <mesh
          material={darkTrayMaterial}
          position={[0, 0.046, -0.36]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.58, 0.94]} />
        </mesh>

        {/* 78 Magic Keyboard Individual Keys */}
        <group name="KeyboardKeys">
          {keyboardKeys.map((k, idx) => (
            <mesh
              key={idx}
              material={keycapMaterial}
              position={[k.x, 0.052, k.z]}
            >
              <boxGeometry args={[k.w, 0.012, k.d]} />
            </mesh>
          ))}
        </group>

        {/* Touch ID Sensor (Top-right of keyboard) */}
        <mesh material={chromeMaterial} position={[1.22, 0.053, -0.76]}>
          <cylinderGeometry args={[0.042, 0.042, 0.008, 24]} />
        </mesh>

        {/* Force Touch Trackpad (Large precision glass with hairline border) */}
        <group position={[0, 0.046, 0.58]}>
          {/* Trackpad Hairline Gap Border */}
          <mesh material={darkTrayMaterial} position={[0, -0.001, 0]}>
            <boxGeometry args={[1.22, 0.004, 0.78]} />
          </mesh>
          {/* Glass Top Surface */}
          <mesh material={trackpadMaterial} position={[0, 0.002, 0]}>
            <boxGeometry args={[1.20, 0.006, 0.76]} />
          </mesh>
        </group>

        {/* I/O Ports: Left Flank (MagSafe 3 + 2x Thunderbolt 4) */}
        <group position={[-width / 2 - 0.008, 0.025, -0.45]}>
          {/* MagSafe 3 Port */}
          <mesh material={darkTrayMaterial} position={[0, 0, -0.28]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.012, 0.035, 8, 12]} />
          </mesh>
          {/* Thunderbolt 4 / USB-C Port 1 */}
          <mesh material={darkTrayMaterial} position={[0, 0, -0.12]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.009, 0.03, 8, 12]} />
          </mesh>
          {/* Thunderbolt 4 / USB-C Port 2 */}
          <mesh material={darkTrayMaterial} position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.009, 0.03, 8, 12]} />
          </mesh>
        </group>

        {/* I/O Ports: Right Flank (3.5mm Headphone Jack) */}
        <group position={[width / 2 + 0.008, 0.025, -0.65]}>
          <mesh material={chromeMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.01, 16]} />
          </mesh>
          <mesh material={darkTrayMaterial} rotation={[0, 0, Math.PI / 2]} position={[0.002, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.01, 16]} />
          </mesh>
        </group>

        {/* Bottom 4 Rubber Feet */}
        <group position={[0, -0.038, 0]}>
          <mesh material={rubberFeetMaterial} position={[-1.25, 0, -0.85]}>
            <cylinderGeometry args={[0.055, 0.055, 0.008, 20]} />
          </mesh>
          <mesh material={rubberFeetMaterial} position={[1.25, 0, -0.85]}>
            <cylinderGeometry args={[0.055, 0.055, 0.008, 20]} />
          </mesh>
          <mesh material={rubberFeetMaterial} position={[-1.25, 0, 0.85]}>
            <cylinderGeometry args={[0.055, 0.055, 0.008, 20]} />
          </mesh>
          <mesh material={rubberFeetMaterial} position={[1.25, 0, 0.85]}>
            <cylinderGeometry args={[0.055, 0.055, 0.008, 20]} />
          </mesh>
        </group>

        {/* Palm Rest Stickers Layer */}
        {childrenBase}
      </group>

      {/* ========================================================================= */}
      {/* 2. HINGE & LID ASSEMBLY (ROTATES BACKWARDS AROUND X-AXIS)                 */}
      {/* ========================================================================= */}
      {/* Hinge Pivot point is at rear edge of base chassis: Z = -1.02, Y = 0.048 */}
      <group
        ref={lidGroupRef}
        name="LidHingeGroup"
        position={[0, 0.048, -1.02]}
      >
        {/* Hinge Cylinder Bar */}
        <mesh
          material={starlightMaterial}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 0, 0]}
        >
          <cylinderGeometry args={[0.024, 0.024, 2.2, 24]} />
        </mesh>

        {/* Lid Body: extends forward in local +Z from pivot (0 to depth) */}
        <group position={[0, 0, depth / 2]}>
          {/* Exterior Starlight Aluminium Unibody Shell */}
          <mesh
            geometry={lidGeometry}
            material={starlightMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.018, 0]}
            castShadow
          />

          {/* Mirrored Apple Logo on Exterior Lid (flush chrome inlay) */}
          <group position={[0, 0.024, 0]}>
            {/* Apple Body */}
            <mesh
              material={chromeMaterial}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
            >
              <circleGeometry args={[0.13, 32]} />
            </mesh>
            {/* Apple Leaf */}
            <mesh
              material={chromeMaterial}
              rotation={[-Math.PI / 2, 0, 0.5]}
              position={[0.03, 0, -0.16]}
            >
              <circleGeometry args={[0.045, 16]} />
            </mesh>
          </group>

          {/* ------------------------------------------------------------------- */}
          {/* Interior Display Side (Faces downwards when closed, faces user when open) */}
          {/* ------------------------------------------------------------------- */}
          <group position={[0, -0.016, 0]}>
            {/* Edge-to-edge Black Glass Bezel */}
            <mesh
              material={bezelMaterial}
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, 0, 0]}
            >
              <planeGeometry args={[width - 0.04, depth - 0.04]} />
            </mesh>

            {/* Liquid Retina 13.6-inch Screen Panel */}
            <mesh
              material={screenMaterial}
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, -0.001, 0.02]}
            >
              <planeGeometry args={[2.84, 1.84]} />
            </mesh>

            {/* Camera Notch at top center */}
            <group position={[0, -0.002, -depth / 2 + 0.06]}>
              {/* Notch Shape */}
              <mesh material={bezelMaterial}>
                <boxGeometry args={[0.22, 0.002, 0.04]} />
              </mesh>
              {/* FaceTime HD Camera Lens */}
              <mesh material={chromeMaterial} position={[0, -0.001, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.002, 16]} />
              </mesh>
              {/* Green Camera Mic Indicator Dot */}
              <mesh position={[0.04, -0.001, 0]}>
                <cylinderGeometry args={[0.003, 0.003, 0.002, 8]} />
                <meshBasicMaterial color="#34c759" />
              </mesh>
            </group>
          </group>

          {/* Lid Exterior Stickers Layer (Rotates seamlessly with the lid!) */}
          {childrenLid}
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 3. PHYSICAL ACCESSORIES (Starlight MagSafe Charger & Magic Mouse)         */}
      {/* ========================================================================= */}
      {/* 35W Dual USB-C Compact MagSafe Power Adapter */}
      <group position={[-2.1, 0.015, 0.2]} castShadow>
        <mesh material={starlightMaterial} position={[0, 0.025, 0]}>
          <boxGeometry args={[0.42, 0.38, 0.42]} />
        </mesh>
        <mesh material={chromeMaterial} position={[0, 0.025, 0.215]}>
          <boxGeometry args={[0.18, 0.015, 0.02]} />
        </mesh>
      </group>

      {/* Multi-Touch Magic Mouse (Starlight edition) */}
      <group position={[2.05, 0.012, 0.2]} castShadow>
        {/* Aluminium Base */}
        <mesh material={starlightMaterial} position={[0, 0.015, 0]}>
          <capsuleGeometry args={[0.18, 0.32, 12, 16]} />
        </mesh>
        {/* Glass Multi-Touch Top */}
        <mesh material={trackpadMaterial} position={[0, 0.032, 0]}>
          <capsuleGeometry args={[0.17, 0.31, 12, 16]} />
        </mesh>
      </group>
    </group>
  );
}
