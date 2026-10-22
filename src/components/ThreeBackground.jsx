import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

/**
 * Advanced 3D particle constellation background.
 *
 * Fully defensive: if WebGL / Three.js fails at any point, the canvas stays
 * transparent and the rest of the page keeps working. The render loop is
 * wrapped in try/catch so a single bad frame can't spam the console.
 *
 * Features:
 *  - Three depth layers (far / mid / near)
 *  - Central interactive core following the mouse
 *  - K-nearest-neighbor connection lines
 *  - Slow color cycle between theme accent and ink
 *  - Click burst particle explosion
 *  - Smooth camera drift
 *  - Respects prefers-reduced-motion
 *  - pointer-events-none so it never blocks UI interaction
 */
const ThreeBackground = ({ className = "" }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const clickRef = useRef(null);
  const burstingRef = useRef(false);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getCssColor = useCallback((name) => {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return val || (name === "--color-accent" ? "#22d3ee" : "#0a0a0a");
  }, []);

  const handleMouseMove = useCallback((event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleClick = useCallback((event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    clickRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
    burstingRef.current = true;
    setTimeout(() => {
      burstingRef.current = false;
      clickRef.current = null;
    }, 800);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Declared at effect scope so animate() can access them.
    let scene, camera, renderer, core, layers, lineGeometries, lineMaterial,
      lineMeshes, burstGeometry, burstMaterial, burstPoints;
    let coreTarget, accent, ink, buildLineGeometry;
    let burstCount, burstPositions, burstVelocities, burstLife;

    // Defensive: bail out if canvas has no size yet.
    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
      return;
    }

    try {
      // --- Scene setup ---
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(
        new THREE.Color(getCssColor("--color-bg")),
        0.018
      );

      camera = new THREE.PerspectiveCamera(
        60,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 12);

      renderer = null;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          webgl2: false,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        });
      } catch (ctxError) {
        console.warn(
          "Three.js: Cannot create WebGL renderer on canvas (existing context or WebGL unavailable):",
          ctxError
        );
        // Leave canvas transparent; page keeps working.
        return;
      }
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // --- Helper to build a particle layer ---
      const createLayer = ({ count, speed, size, opacity, zRange, color }) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const originals = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
          positions[i * 3 + 2] = (Math.random() - 0.5) * zRange;

          originals[i * 3] = positions[i * 3];
          originals[i * 3 + 1] = positions[i * 3 + 1];
          originals[i * 3 + 2] = positions[i * 3 + 2];

          velocities[i * 3] = (Math.random() - 0.5) * speed;
          velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.5;

          scales[i] = 0.4 + Math.random() * 0.8;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute("original", new THREE.BufferAttribute(originals, 3));

        const material = new THREE.PointsMaterial({
          size,
          color,
          transparent: true,
          opacity,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        return {
          geometry,
          material,
          points,
          positions,
          velocities,
          originals,
          scales,
          count,
        };
      };

      accent = new THREE.Color(getCssColor("--color-accent"));
      ink = new THREE.Color(getCssColor("--color-ink"));

      // Three depth layers
      layers = [
        createLayer({
          count: reducedMotion ? 30 : 60,
          speed: 0.004,
          size: 0.05,
          opacity: 0.25,
          zRange: 30,
          color: accent,
        }),
        createLayer({
          count: reducedMotion ? 50 : 110,
          speed: 0.007,
          size: 0.08,
          opacity: 0.45,
          zRange: 18,
          color: new THREE.Color().copy(accent).lerp(ink, 0.35),
        }),
        createLayer({
          count: reducedMotion ? 25 : 50,
          speed: 0.011,
          size: 0.11,
          opacity: 0.65,
          zRange: 9,
          color: ink,
        }),
      ];

      // --- Central interactive core ---
      const coreGeometry = new THREE.SphereGeometry(0.35, 24, 24);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.z = 0;
      scene.add(core);

      coreTarget = { x: 0, y: 0, z: 0 };

      // --- Connection lines ---
      buildLineGeometry = (layer, maxDist) => {
        const pos = layer.positions;
        const linePos = [];
        const k = 3;

        for (let i = 0; i < layer.count; i++) {
          const ix = pos[i * 3];
          const iy = pos[i * 3 + 1];
          const iz = pos[i * 3 + 2];

          const dists = [];
          for (let j = 0; j < layer.count; j++) {
            if (i === j) continue;
            const dx = ix - pos[j * 3];
            const dy = iy - pos[j * 3 + 1];
            const dz = iz - pos[j * 3 + 2];
            const d = dx * dx + dy * dy + dz * dz;
            dists.push({ j, d });
          }
          dists.sort((a, b) => a.d - b.d);

          for (let n = 0; n < Math.min(k, dists.length); n++) {
            const j = dists[n].j;
            if (dists[n].d > maxDist * maxDist) continue;
            linePos.push(
              ix, iy, iz,
              pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
            );
          }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(linePos, 3)
        );
        return geometry;
      };

      lineGeometries = layers.map((layer) =>
        buildLineGeometry(layer, reducedMotion ? 0 : 3.2)
      );
      lineMaterial = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      });
      lineMeshes = lineGeometries.map(
        (geo) => new THREE.LineSegments(geo, lineMaterial)
      );
      lineMeshes.forEach((mesh) => scene.add(mesh));

      // --- Burst particles ---
      burstCount = 24;
      burstGeometry = new THREE.BufferGeometry();
      burstPositions = new Float32Array(burstCount * 3);
      burstVelocities = new Array(burstCount).fill(null);
      burstLife = new Array(burstCount).fill(0);
      burstGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(burstPositions, 3)
      );
      burstMaterial = new THREE.PointsMaterial({
        size: 0.16,
        color: accent,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      });
      burstPoints = new THREE.Points(burstGeometry, burstMaterial);
      burstPoints.visible = false;
      scene.add(burstPoints);
    } catch (error) {
      console.warn("Three.js background failed to initialize:", error);
      // Leave canvas transparent; page keeps working.
      return;
    }

    const startTimeRef = { current: Date.now() };

    // --- Animation loop (wrapped in try/catch) ---
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      try {
        if (!renderer || !scene || !camera) return;

        const now = (Date.now() - startTimeRef.current) * 0.001;

        // Slow color cycle
        const t = (Math.sin(now * 0.5) + 1) / 2;
        const cycleColor = new THREE.Color().copy(accent).lerp(ink, t * 0.4);
        lineMaterial.color.copy(cycleColor);

        // Core follows mouse
        if (!reducedMotion && core) {
          coreTarget.x += (mouseRef.current.x * 4 - core.position.x) * 0.06;
          coreTarget.y += (mouseRef.current.y * 3 - core.position.y) * 0.06;
          core.position.x = coreTarget.x;
          core.position.y = coreTarget.y;
          core.position.z = Math.sin(now * 1.5) * 0.5;

          core.material.color.copy(cycleColor);
          core.material.opacity =
            0.4 + Math.sin(now * 3) * 0.15;
          core.material.opacity = Math.max(
            0.2,
            Math.min(0.8, core.material.opacity)
          );
          core.rotation.y += 0.015;
          core.rotation.x += 0.01;
        }

        // Update each layer
        if (layers) {
          layers.forEach((layer, idx) => {
            const pos = layer.positions;
            const orig = layer.originals;
            const scaleArr = layer.scales;

            for (let i = 0; i < layer.count; i++) {
              pos[i * 3] += layer.velocities[i * 3];
              pos[i * 3 + 1] += layer.velocities[i * 3 + 1];
              pos[i * 3 + 2] += layer.velocities[i * 3 + 2];

              const spring = 0.003 * (idx + 1);
              pos[i * 3] += (orig[i * 3] - pos[i * 3]) * spring;
              pos[i * 3 + 1] += (orig[i * 3 + 1] - pos[i * 3 + 1]) * spring;
              pos[i * 3 + 2] += (orig[i * 3 + 2] - pos[i * 3 + 2]) * spring;

              if (!reducedMotion) {
                const dx = pos[i * 3] - mouseRef.current.x * 4;
                const dy = pos[i * 3 + 1] - mouseRef.current.y * 3;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0 && dist < 5) {
                  const force = (5 - dist) / 5;
                  pos[i * 3] += (dx / dist) * force * 0.03;
                  pos[i * 3 + 1] += (dy / dist) * force * 0.03;
                }
              }

              if (pos[i * 3] > 12) pos[i * 3] = -12;
              if (pos[i * 3] < -12) pos[i * 3] = 12;
              if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = -9;
              if (pos[i * 3 + 1] < -9) pos[i * 3 + 1] = 9;
              if (pos[i * 3 + 2] > 16) pos[i * 3 + 2] = -16;
              if (pos[i * 3 + 2] < -16) pos[i * 3 + 2] = 16;

              scaleArr[i] =
                scaleArr[i] + Math.sin(now * 2 + i) * 0.02;
            }

            layer.geometry.attributes.position.needsUpdate = true;
            layer.geometry.attributes.scale.needsUpdate = true;

            if (
              idx === 1 &&
              Math.floor(now * 10) % 8 === 0 &&
              !reducedMotion &&
              buildLineGeometry
            ) {
              const newGeo = buildLineGeometry(layer, 3.2);
              lineGeometries[idx]?.dispose();
              lineMeshes[idx].geometry = newGeo;
              lineGeometries[idx] = newGeo;
            }
          });
        }

        // Burst animation
        if (
          burstingRef.current &&
          clickRef.current &&
          burstPoints &&
          burstCount &&
          burstVelocities &&
          burstLife
        ) {
          burstPoints.visible = true;
          burstPoints.position.set(
            clickRef.current.x * 8,
            clickRef.current.y * 6,
            0
          );

          const bp = burstGeometry.attributes.position.array;
          for (let i = 0; i < burstCount; i++) {
            if (!burstVelocities[i]) {
              const angle = (i / burstCount) * Math.PI * 2;
              const speed = 0.04 + Math.random() * 0.06;
              burstVelocities[i] = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed,
                z: (Math.random() - 0.5) * 0.04,
              };
              burstLife[i] = 1;
            }
            bp[i * 3] += burstVelocities[i].x;
            bp[i * 3 + 1] += burstVelocities[i].y;
            bp[i * 3 + 2] += burstVelocities[i].z;
            burstLife[i] *= 0.92;
          }
          burstGeometry.attributes.position.needsUpdate = true;
          burstMaterial.opacity = Math.max(0, burstLife[0] || 0);
          if (burstLife[0] < 0.05) {
            burstingRef.current = false;
            clickRef.current = null;
            burstPoints.visible = false;
          }
        } else if (burstPoints) {
          burstPoints.visible = false;
        }

        // Smooth camera drift
        camera.position.x = Math.sin(now * 0.2) * 0.6;
        camera.position.y = Math.cos(now * 0.15) * 0.4;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      } catch (renderError) {
        // Suppress per-frame errors to avoid console spam.
        console.warn("Three.js render error:", renderError);
        cancelAnimationFrame(rafRef.current);
      }
    };

    animate();

    const handleResize = () => {
      if (!camera || !renderer) return;
      if (canvas.clientWidth === 0 || canvas.clientHeight === 0) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("resize", handleResize);

    // Handle WebGL context loss gracefully.
    const onContextLost = (event) => {
      event.preventDefault();
      cancelAnimationFrame(rafRef.current);
    };
    const onContextRestored = () => {
      // Page reload is simplest recovery; just stop rendering for now.
      cancelAnimationFrame(rafRef.current);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("resize", handleResize);

      if (!renderer || !scene) return;

      layers?.forEach((layer) => {
        layer?.geometry?.dispose();
        layer?.material?.dispose();
      });
      lineGeometries?.forEach((g) => g?.dispose());
      lineMaterial?.dispose();
      lineMeshes?.forEach((m) => scene?.remove(m));
      core?.geometry?.dispose();
      core?.material?.dispose();
      scene?.remove(core);
      burstGeometry?.dispose();
      burstMaterial?.dispose();
      scene?.remove(burstPoints);
      renderer.dispose();
    };
  }, [getCssColor, reducedMotion, handleMouseMove, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-[-1] bg-transparent ${className}`}
      style={{ background: "transparent" }}
    />
  );
};

export default ThreeBackground;
