"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface JointVisualizer3DProps {
  angle?: number;
  targetAngle?: number;
  interactive?: boolean;
  height?: number;
  showLabels?: boolean;
  showBadges?: boolean;
  theme?: "light" | "dark";
}

export default function JointVisualizer3D({
  angle = 45,
  targetAngle = 90,
  interactive = true,
  height = 360,
  showLabels = true,
  showBadges = true,
  theme = "light",
}: JointVisualizer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalAngle, setInternalAngle] = useState(angle);
  const [isRotating, setIsRotating] = useState(true);

  const displayAngle = interactive ? internalAngle : angle;
  const targetAngleRef = useRef(targetAngle);
  targetAngleRef.current = targetAngle;

  const currentAngleRef = useRef(displayAngle);
  currentAngleRef.current = displayAngle;

  useEffect(() => {
    setInternalAngle(angle);
  }, [angle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const isLight = theme === "light";
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isLight ? "#F1F6FB" : "#0A1424");

    const width = container.clientWidth || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.9 : 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x0ea5e9, isLight ? 1.5 : 1.8);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, isLight ? 1.0 : 1.2);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, isLight ? 1.2 : 1.5, 10);
    rimLight.position.set(0, -2, 3);
    scene.add(rimLight);

    // 3. Materials
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: isLight ? 0xc8d7e6 : 0xebf2f8,
      roughness: 0.35,
      metalness: 0.15,
    });

    const jointCartilageMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: isLight ? 0.25 : 0.3,
    });

    const ligamentMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x059669,
      emissiveIntensity: isLight ? 0.35 : 0.4,
    });

    const patellaMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.1,
    });

    // 4. Model Hierarchy
    const legGroup = new THREE.Group();
    scene.add(legGroup);

    // Pelvis / Hip base marker
    const hipGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.35, 16);
    const hipMesh = new THREE.Mesh(hipGeo, boneMaterial);
    hipMesh.position.set(0, 1.8, 0);
    legGroup.add(hipMesh);

    // Femur (Upper leg)
    const femurGroup = new THREE.Group();
    femurGroup.position.set(0, 1.6, 0);
    legGroup.add(femurGroup);

    const femurShaftGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.6, 20);
    const femurShaft = new THREE.Mesh(femurShaftGeo, boneMaterial);
    femurShaft.position.set(0, -0.8, 0);
    femurGroup.add(femurShaft);

    // Femoral Condyles (Knee joint top)
    const condyleGeo = new THREE.SphereGeometry(0.22, 20, 20);
    const condyleLeft = new THREE.Mesh(condyleGeo, jointCartilageMaterial);
    condyleLeft.position.set(-0.12, -1.6, 0);
    femurGroup.add(condyleLeft);

    const condyleRight = new THREE.Mesh(condyleGeo, jointCartilageMaterial);
    condyleRight.position.set(0.12, -1.6, 0);
    femurGroup.add(condyleRight);

    // Knee Pivot Joint
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -1.6, 0);
    femurGroup.add(kneePivot);

    // Tibia / Fibula (Lower leg, rotates around kneePivot)
    const lowerLegGroup = new THREE.Group();
    kneePivot.add(lowerLegGroup);

    // Tibial plateau
    const plateauGeo = new THREE.CylinderGeometry(0.26, 0.2, 0.2, 20);
    const plateau = new THREE.Mesh(plateauGeo, jointCartilageMaterial);
    plateau.position.set(0, -0.1, 0);
    lowerLegGroup.add(plateau);

    // Tibia shaft
    const tibiaShaftGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.6, 20);
    const tibiaShaft = new THREE.Mesh(tibiaShaftGeo, boneMaterial);
    tibiaShaft.position.set(-0.04, -0.95, 0);
    lowerLegGroup.add(tibiaShaft);

    // Fibula (thinner lateral bone)
    const fibulaShaftGeo = new THREE.CylinderGeometry(0.045, 0.04, 1.5, 12);
    const fibulaShaft = new THREE.Mesh(fibulaShaftGeo, boneMaterial);
    fibulaShaft.position.set(0.16, -0.98, -0.02);
    lowerLegGroup.add(fibulaShaft);

    // Ankle / Foot base
    const footGeo = new THREE.BoxGeometry(0.26, 0.14, 0.65);
    const foot = new THREE.Mesh(footGeo, boneMaterial);
    foot.position.set(-0.04, -1.8, 0.16);
    lowerLegGroup.add(foot);

    // Patella (Kneecap)
    const patellaGeo = new THREE.SphereGeometry(0.14, 16, 16);
    patellaGeo.scale(1, 1.2, 0.6);
    const patella = new THREE.Mesh(patellaGeo, patellaMaterial);
    patella.position.set(0, 0.05, 0.26);
    lowerLegGroup.add(patella);

    // Cruciate / Collateral Ligament bands
    const lclGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8);
    const lcl = new THREE.Mesh(lclGeo, ligamentMaterial);
    lcl.position.set(0.22, 0, 0);
    lowerLegGroup.add(lcl);

    const mclGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8);
    const mcl = new THREE.Mesh(mclGeo, ligamentMaterial);
    mcl.position.set(-0.22, 0, 0);
    lowerLegGroup.add(mcl);

    // ROM Arc Indicator (Torus segment)
    const arcRadius = 0.9;
    const arcGeo = new THREE.TorusGeometry(arcRadius, 0.025, 16, 60, Math.PI * 0.7);
    const arcMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.5,
    });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.rotation.y = Math.PI / 2;
    arcMesh.position.set(0, 0, 0);
    kneePivot.add(arcMesh);

    // Floor grid
    const grid = new THREE.GridHelper(
      8,
      16,
      isLight ? 0xbed2e6 : 0x1e293b,
      isLight ? 0xdce8f2 : 0x0f172a
    );
    grid.position.y = -2.2;
    scene.add(grid);

    // Mouse drag interaction
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      legGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(0.2, Math.min(3, camera.position.y - deltaY * 0.008));
      camera.lookAt(0, 0, 0);

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Animation Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth knee joint rotation to reflect angle
      const targetRad = THREE.MathUtils.degToRad(currentAngleRef.current);
      lowerLegGroup.rotation.x = THREE.MathUtils.lerp(lowerLegGroup.rotation.x, targetRad, 0.12);

      // Color ligaments dynamically: green in safe range, amber approaching target, red beyond
      const dev = Math.abs(currentAngleRef.current - targetAngleRef.current);
      if (currentAngleRef.current > targetAngleRef.current + 15) {
        ligamentMaterial.color.setHex(0xef4444);
        ligamentMaterial.emissive.setHex(0xb91c1c);
      } else if (dev <= 10) {
        ligamentMaterial.color.setHex(0x10b981);
        ligamentMaterial.emissive.setHex(0x059669);
      } else {
        ligamentMaterial.color.setHex(0x38bdf8);
        ligamentMaterial.emissive.setHex(0x0284c7);
      }

      // Gentle auto-rotation if idle
      if (isRotating && !isDragging) {
        legGroup.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      renderer.dispose();
      scene.clear();
    };
  }, [height, isRotating, theme]);

  const isLight = theme === "light";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border shadow-lg ${
        isLight
          ? "border-slate-200 bg-white"
          : "border-slate-700/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl"
      }`}
    >
      {/* 3D Canvas container */}
      <div
        ref={containerRef}
        className="w-full cursor-grab active:cursor-grabbing select-none"
        style={{ height }}
      />

      {/* Overlay badges */}
      {showBadges && (
        <>
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md text-xs font-semibold ${
                isLight
                  ? "bg-white/90 border-sky-500/20 text-sky-700 shadow-sm"
                  : "bg-slate-900/80 border-sky-500/30 text-sky-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Interactive 3D Biomechanics
            </div>
            <div
              className={`text-[11px] pl-1 font-medium ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Drag to orbit · Real-time joint kinetics
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md transition-all ${
                isLight
                  ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                  : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700"
              }`}
            >
              {isRotating ? "⏸ Pause Rotation" : "▶ Rotate"}
            </button>
          </div>
        </>
      )}

      {/* Angle Readout & Interactive Controller */}
      {showLabels && (
        <div
          className={`p-4 border-t backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight
              ? "border-slate-200 bg-white/95 text-slate-800"
              : "border-slate-800 bg-slate-950/80 text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <div>
              <span
                className={`text-[11px] uppercase tracking-wider font-bold block ${
                  isLight ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Joint Flexion
              </span>
              <span
                className={`text-2xl font-bold font-mono ${
                  isLight ? "text-sky-600" : "text-sky-400"
                }`}
              >
                {Math.round(displayAngle)}°
              </span>
            </div>
            <div
              className={`h-8 w-px ${isLight ? "bg-slate-200" : "bg-slate-800"}`}
            />
            <div>
              <span
                className={`text-[11px] uppercase tracking-wider font-bold block ${
                  isLight ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Target Angle
              </span>
              <span
                className={`text-lg font-semibold font-mono ${
                  isLight ? "text-emerald-600" : "text-emerald-400"
                }`}
              >
                {targetAngle}°
              </span>
            </div>
          </div>

          {interactive && (
            <div className="flex-1 max-w-xs w-full flex items-center gap-3">
              <span
                className={`text-xs font-mono font-medium ${
                  isLight ? "text-slate-400" : "text-slate-400"
                }`}
              >
                0°
              </span>
              <input
                type="range"
                min="0"
                max="135"
                value={internalAngle}
                onChange={(e) => setInternalAngle(Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                  isLight ? "bg-slate-200 accent-sky-600" : "bg-slate-800 accent-sky-400"
                }`}
              />
              <span
                className={`text-xs font-mono font-medium ${
                  isLight ? "text-slate-400" : "text-slate-400"
                }`}
              >
                135°
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
