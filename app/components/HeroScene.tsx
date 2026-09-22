"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, Eye } from "lucide-react";

interface HeroSceneProps {
  autoCycle?: boolean;
  initialMode?: "clinical" | "wireframe";
  showControls?: boolean;
  className?: string;
}

export default function HeroScene({
  autoCycle = true,
  initialMode = "clinical",
  showControls = true,
  className = "",
}: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"clinical" | "wireframe">(initialMode);
  const [isPlaying, setIsPlaying] = useState(autoCycle);
  const [currentAngle, setCurrentAngle] = useState(72);
  const [ligamentStatus, setLigamentStatus] = useState<"optimal" | "approaching" | "limit">("optimal");

  // Keep refs for the animation loop
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const angleRef = useRef(currentAngle);
  angleRef.current = currentAngle;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── 1. Scene Setup ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // ── 2. Lighting ───────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x0ea5e9, 2.0);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, 1.4);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 12);
    rimLight.position.set(0, -2, 3);
    scene.add(rimLight);

    // ── 3. Materials ──────────────────────────────────────────────────────────
    // Clinical bone materials
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.3,
      metalness: 0.12,
    });

    const jointCartilageMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });

    const ligamentMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.25,
      metalness: 0.2,
      emissive: 0x059669,
      emissiveIntensity: 0.45,
    });

    const patellaMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Wireframe materials
    const wireframeBoneMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    const wireframeJointMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    const wireframeLigamentMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });

    // ── 4. Anatomical Model Hierarchy ─────────────────────────────────────────
    const rootGroup = new THREE.Group();
    // Center the knee joint near Y = -0.1
    rootGroup.position.set(0, 0.4, 0);
    scene.add(rootGroup);

    // Pelvis / Hip base marker
    const hipGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.3, 16);
    const hipMesh = new THREE.Mesh(hipGeo, boneMaterial);
    hipMesh.position.set(0, 1.75, 0);
    rootGroup.add(hipMesh);

    // Femur (Upper leg group)
    const femurGroup = new THREE.Group();
    femurGroup.position.set(0, 1.6, 0);
    rootGroup.add(femurGroup);

    // Femur shaft
    const femurShaftGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.5, 20);
    const femurShaft = new THREE.Mesh(femurShaftGeo, boneMaterial);
    femurShaft.position.set(0, -0.75, 0);
    femurGroup.add(femurShaft);

    // Femoral condyles (medial & lateral)
    const condyleGeo = new THREE.SphereGeometry(0.2, 20, 20);
    const condyleLeft = new THREE.Mesh(condyleGeo, jointCartilageMaterial);
    condyleLeft.position.set(-0.11, -1.5, 0);
    femurGroup.add(condyleLeft);

    const condyleRight = new THREE.Mesh(condyleGeo, jointCartilageMaterial);
    condyleRight.position.set(0.11, -1.5, 0);
    femurGroup.add(condyleRight);

    // Knee Pivot Joint (axis of flexion/extension)
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -1.5, 0);
    femurGroup.add(kneePivot);

    // Lower Leg Group (Tibia, Fibula, Ankle, Patella) - rotates around kneePivot!
    const lowerLegGroup = new THREE.Group();
    kneePivot.add(lowerLegGroup);

    // Tibial plateau
    const plateauGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.18, 20);
    const plateau = new THREE.Mesh(plateauGeo, jointCartilageMaterial);
    plateau.position.set(0, -0.09, 0);
    lowerLegGroup.add(plateau);

    // Tibia shaft
    const tibiaShaftGeo = new THREE.CylinderGeometry(0.11, 0.08, 1.5, 20);
    const tibiaShaft = new THREE.Mesh(tibiaShaftGeo, boneMaterial);
    tibiaShaft.position.set(-0.03, -0.88, 0);
    lowerLegGroup.add(tibiaShaft);

    // Fibula shaft (lateral slender bone)
    const fibulaShaftGeo = new THREE.CylinderGeometry(0.04, 0.035, 1.4, 12);
    const fibulaShaft = new THREE.Mesh(fibulaShaftGeo, boneMaterial);
    fibulaShaft.position.set(0.15, -0.9, -0.02);
    lowerLegGroup.add(fibulaShaft);

    // Ankle / Foot marker
    const footGeo = new THREE.BoxGeometry(0.24, 0.12, 0.55);
    const foot = new THREE.Mesh(footGeo, boneMaterial);
    foot.position.set(-0.03, -1.68, 0.14);
    lowerLegGroup.add(foot);

    // Patella (Kneecap)
    const patellaGeo = new THREE.SphereGeometry(0.13, 16, 16);
    patellaGeo.scale(1, 1.25, 0.55);
    const patella = new THREE.Mesh(patellaGeo, patellaMaterial);
    patella.position.set(0, 0.04, 0.24);
    lowerLegGroup.add(patella);

    // Ligament bands: LCL & MCL
    const lclGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.42, 8);
    const lcl = new THREE.Mesh(lclGeo, ligamentMaterial);
    lcl.position.set(0.2, 0, 0);
    lowerLegGroup.add(lcl);

    const mclGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.42, 8);
    const mcl = new THREE.Mesh(mclGeo, ligamentMaterial);
    mcl.position.set(-0.2, 0, 0);
    lowerLegGroup.add(mcl);

    // Anterior Cruciate Ligament (ACL) representation
    const aclGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8);
    const acl = new THREE.Mesh(aclGeo, ligamentMaterial);
    acl.position.set(0, 0.02, -0.04);
    acl.rotation.z = 0.3;
    acl.rotation.x = -0.2;
    lowerLegGroup.add(acl);

    // ROM Arc Indicator (Glowing Torus segment)
    const arcGeo = new THREE.TorusGeometry(0.85, 0.02, 16, 60, Math.PI * 0.5);
    const arcMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.55,
    });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.rotation.y = Math.PI / 2;
    arcMesh.rotation.z = Math.PI;
    arcMesh.position.set(0, 0, 0);
    kneePivot.add(arcMesh);

    // Floor grid
    const grid = new THREE.GridHelper(6, 14, 0x0ea5e9, 0x1e293b);
    grid.position.y = -2.1;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    scene.add(grid);

    // Collect meshes for mode switching
    const boneMeshes: THREE.Mesh[] = [hipMesh, femurShaft, tibiaShaft, fibulaShaft, foot, patella];
    const jointMeshes: THREE.Mesh[] = [condyleLeft, condyleRight, plateau];
    const ligamentMeshes: THREE.Mesh[] = [lcl, mcl, acl];

    function applyRenderMode(m: "clinical" | "wireframe") {
      const isWire = m === "wireframe";
      boneMeshes.forEach((mesh) => {
        mesh.material = (isWire ? wireframeBoneMat : boneMaterial) as THREE.Material;
      });
      jointMeshes.forEach((mesh) => {
        mesh.material = (isWire ? wireframeJointMat : jointCartilageMaterial) as THREE.Material;
      });
      ligamentMeshes.forEach((mesh) => {
        mesh.material = (isWire ? wireframeLigamentMat : ligamentMaterial) as THREE.Material;
      });
    }

    applyRenderMode(modeRef.current);

    // ── 5. Mouse / Touch Orbit Controls ───────────────────────────────────────
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousX = clientX;
      previousY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousX;
      const deltaY = clientY - previousY;

      rootGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(-0.5, Math.min(2.0, camera.position.y - deltaY * 0.008));
      camera.lookAt(0, 0.2, 0);

      previousX = clientX;
      previousY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // ── 6. Kinematic Animation Loop ───────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();
    let simAngle = angleRef.current;
    let lastUiUpdate = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Check mode changes
      if (modeRef.current !== (boneMeshes[0].material === wireframeBoneMat ? "wireframe" : "clinical")) {
        applyRenderMode(modeRef.current);
      }

      // Continuous clinical rehabilitation flexion cycle (0° to 90° back and forth)
      if (isPlayingRef.current) {
        // Sine wave oscillating between 15° and 92°
        const cycleProgress = (Math.sin(elapsedTime * 1.3) + 1) / 2; // 0 to 1
        simAngle = THREE.MathUtils.lerp(18, 92, cycleProgress);
        angleRef.current = simAngle;
      }

      // Smooth joint rotation (flexion around X axis)
      const targetRad = THREE.MathUtils.degToRad(simAngle);
      lowerLegGroup.rotation.x = THREE.MathUtils.lerp(lowerLegGroup.rotation.x, targetRad, 0.12);

      // Ligament color dynamics
      if (modeRef.current === "clinical") {
        if (simAngle > 85) {
          // Approaching flexion target limit
          ligamentMaterial.color.setHex(0xf59e0b); // amber
          ligamentMaterial.emissive.setHex(0xb45309);
        } else if (simAngle < 30) {
          // Extension
          ligamentMaterial.color.setHex(0x0ea5e9); // sky blue
          ligamentMaterial.emissive.setHex(0x0284c7);
        } else {
          // Safe mid-range
          ligamentMaterial.color.setHex(0x10b981); // emerald
          ligamentMaterial.emissive.setHex(0x059669);
        }
      }

      // Gentle auto-rotation when idle
      if (!isDragging) {
        rootGroup.rotation.y += 0.003;
      }

      // Periodic state throttle for React HUD (every 120ms)
      const now = performance.now();
      if (now - lastUiUpdate > 120) {
        setCurrentAngle(Math.round(simAngle));
        setLigamentStatus(simAngle > 85 ? "limit" : simAngle > 60 ? "approaching" : "optimal");
        lastUiUpdate = now;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 7. Resize Observer ────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ── 8. Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[460px] select-none overflow-hidden ${className}`}>
      {/* Three.js Canvas mount */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: "460px" }}
      />

      {/* Top Clinical Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-sky-500/30 backdrop-blur-md text-xs font-semibold text-sky-600 dark:text-sky-400 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-Time 3D Biomechanics
        </div>
        <span className="text-[11px] text-slate-500 font-medium pl-1">
          Drag to orbit 360° · Knee Kinematics
        </span>
      </div>

      {/* Floating HUD angle & status */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-lg backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Joint Flexion
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">
              {currentAngle}°
            </span>
            <span className="text-xs text-slate-400">/ 90° ROM</span>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex flex-col text-[11px]">
          <span className="text-slate-400 font-medium">Ligament Stress</span>
          <span
            className={`font-semibold ${
              ligamentStatus === "limit"
                ? "text-amber-500"
                : ligamentStatus === "approaching"
                ? "text-emerald-500"
                : "text-sky-500"
            }`}
          >
            {ligamentStatus === "limit"
              ? "Target Flexion"
              : ligamentStatus === "approaching"
              ? "Smooth Motion"
              : "ACL Relaxed"}
          </span>
        </div>
      </div>

      {/* Interactive Controls Pill */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Flexion Cycle" : "Play Flexion Cycle"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-500" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500" />
                <span>Animate</span>
              </>
            )}
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          <button
            type="button"
            onClick={() => setMode(mode === "clinical" ? "wireframe" : "clinical")}
            title="Toggle View Mode"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-sky-500" />
            <span className="capitalize">{mode === "clinical" ? "Anatomy" : "Wireframe"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
