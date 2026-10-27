import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink, Github, MousePointerClick } from "lucide-react";
import * as THREE from "three";
import { gsap } from "../lib/gsap";
import { projects } from "../data/projects";

/* ------------------------------------------------------------------ */
/*  Category helpers                                                   */
/* ------------------------------------------------------------------ */

const CATEGORY_HEX = {
  frontend: 0x22d3ee,
  backend: 0xf59e0b,
  data: 0xa855f7,
  devops: 0x10b981,
  default: 0x64748b,
};

const CATEGORY_LABEL = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Data",
  devops: "DevOps",
  default: "Project",
};

const KEYWORDS = {
  frontend: ["html", "css", "tailwind", "react", "nextjs", "vue", "nuxtjs", "threejs", "better_auth"],
  backend: ["nodejs", "express", "golang", "gin", "gorm", "python", "airflow"],
  data: ["postgresql", "mongodb", "prisma", "minio", "metabase", "tableau"],
  devops: ["docker", "zustand"],
};

const TECH_NAMES = {
  html: "HTML",
  css: "CSS",
  tailwind: "Tailwind",
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  nuxtjs: "Nuxt",
  nodejs: "Node.js",
  express: "Express",
  golang: "Go",
  gin: "Gin",
  gorm: "GORM",
  python: "Python",
  airflow: "Airflow",
  minio: "MinIO",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  prisma: "Prisma",
  metabase: "Metabase",
  tableau: "Tableau",
  docker: "Docker",
  zustand: "Zustand",
  threejs: "Three.js",
  better_auth: "Better Auth",
};

/** Imported assets are URL strings. Recover a stable key from the file name. */
const techKey = (tech) => {
  if (typeof tech !== "string") return "";
  const file = tech.split("/").pop() ?? "";
  return file.replace(/\.[^.]+$/, "").toLowerCase();
};

const techLabel = (tech) => {
  const key = techKey(tech);
  if (!key || key.length > 24) return "Tech";
  return TECH_NAMES[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
};

const categorize = (techList) => {
  const keys = techList.map(techKey);
  for (const [category, words] of Object.entries(KEYWORDS)) {
    if (keys.some((key) => words.includes(key))) return category;
  }
  return "default";
};

const hexToCss = (hex) => `#${hex.toString(16).padStart(6, "0")}`;

/* ------------------------------------------------------------------ */
/*  Screen texture                                                     */
/* ------------------------------------------------------------------ */

const SCREEN_W = 768;
const SCREEN_H = 512;

const drawCover = (ctx, img) => {
  const ratio = img.width / img.height;
  const target = SCREEN_W / SCREEN_H;
  let w = SCREEN_W;
  let h = SCREEN_H;
  if (ratio > target) w = SCREEN_H * ratio;
  else h = SCREEN_W / ratio;
  ctx.drawImage(img, (SCREEN_W - w) / 2, (SCREEN_H - h) / 2, w, h);
};

const wrapTitle = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const paintScreen = (canvas, project, accent, index, image) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0a1017";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  if (image) drawCover(ctx, image);

  const gradient = ctx.createLinearGradient(0, SCREEN_H * 0.38, 0, SCREEN_H);
  gradient.addColorStop(0, "rgba(4, 9, 14, 0)");
  gradient.addColorStop(0.55, "rgba(4, 9, 14, 0.72)");
  gradient.addColorStop(1, "rgba(4, 9, 14, 0.96)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Category tint strip
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, SCREEN_W, 10);

  // Index chip
  ctx.fillStyle = accent;
  ctx.fillRect(28, 30, 82, 38);
  ctx.fillStyle = "#041016";
  ctx.font = "700 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index + 1).padStart(2, "0"), 48, 50);

  // Title
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
  const lines = wrapTitle(ctx, project.title, SCREEN_W - 56).slice(0, 2);
  const startY = SCREEN_H - 54 - (lines.length - 1) * 58;
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 18;
  lines.forEach((line, i) => {
    ctx.fillText(line, 28, startY + i * 58);
  });
  ctx.shadowBlur = 0;

  // Thin category frame
  ctx.strokeStyle = `${accent}99`;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, SCREEN_W - 6, SCREEN_H - 6);
};

/* ------------------------------------------------------------------ */
/*  Assets                                                             */
/* ------------------------------------------------------------------ */

const ROW_SIZE = 5;
const ROWS = [
  projects.slice(0, ROW_SIZE),
  projects.slice(ROW_SIZE, ROW_SIZE * 2),
  projects.slice(ROW_SIZE * 2),
];

const BLOCK_SIZE = 2.2;
const SCREEN_WIDTH = 1.9;
const SCREEN_HEIGHT = (SCREEN_WIDTH * SCREEN_H) / SCREEN_W;
const BLOCK_GAP_X = 3.2;
const ROW_GAP_Y = 2.5;
const WALL_Z = -7.6;
const ROW_Z_STEP = 0.7;
const EYE_HEIGHT = 1.75;

const Showcase = () => {
  const containerRef = useRef(null);
  const canvasElRef = useRef(null);
  const panelRef = useRef(null);
  const panelOpenRef = useRef(false);

  const [webglError, setWebglError] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [lockHint, setLockHint] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const selectedProject = selectedIndex === null ? null : projects[selectedIndex];

  /* ---------------- open / close detail ---------------- */
  const closeProject = () => {
    panelOpenRef.current = false;
    setPanelOpen(false);
  };

  const togglePointerLock = () => {
    const canvas = canvasElRef.current;
    if (!canvas) return;
    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
      return;
    }
    try {
      const request = canvas.requestPointerLock();
      if (request && typeof request.catch === "function") {
        request.catch(() => setLockHint("Mouse lock is blocked here — drag on the world to look around."));
      }
    } catch {
      setLockHint("Mouse lock is unavailable — drag on the world to look around.");
    }
  };

  /* ---------------- panel entrance ---------------- */
  useEffect(() => {
    if (!panelOpen || !panelRef.current) return;
    const tween = gsap.fromTo(
      panelRef.current,
      { y: 24, autoAlpha: 0, scale: 0.985 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" },
    );
    return () => tween.kill();
  }, [panelOpen]);

  /* ---------------- 3D world ---------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A throwaway probe. Never request a context on the render canvas:
    // a WebGL1 context there would make Three.js (WebGL2-only) fail.
    let probe = null;
    try {
      probe = document.createElement("canvas").getContext("webgl2");
    } catch {
      probe = null;
    }
    if (!probe) {
      setTimeout(() => setWebglError(true), 0);
      return;
    }
    probe.getExtension("WEBGL_lose_context")?.loseContext();

    let disposed = false;
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 block h-full w-full touch-none";
    canvas.style.background = "#05070a";
    canvas.style.cursor = "grab";
    container.prepend(canvas);
    canvasElRef.current = canvas;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.warn("Showcase: WebGL renderer failed", error);
      canvas.remove();
      canvasElRef.current = null;
      setTimeout(() => setWebglError(true), 0);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x05070a, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05070a, 24, 68);

    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 140);
    camera.rotation.order = "YXZ";
    camera.position.set(0, EYE_HEIGHT, 4.6);
    let yaw = 0;
    let pitch = 0.22;
    camera.rotation.set(pitch, yaw, 0);

    /* ---------------- lights ---------------- */
    scene.add(new THREE.HemisphereLight(0x8fd4ff, 0x071018, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(7, 13, 9);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x22d3ee, 0.55);
    rimLight.position.set(-9, 5, -10);
    scene.add(rimLight);

    /* ---------------- ground ---------------- */
    const groundGeometry = new THREE.PlaneGeometry(180, 180);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x081018 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const grid = new THREE.GridHelper(180, 180, 0x1d4b63, 0x10303f);
    grid.position.y = 0.015;
    grid.material.transparent = true;
    grid.material.opacity = 0.45;
    scene.add(grid);

    /* ---------------- distant voxels ---------------- */
    const decorGeometry = new THREE.BoxGeometry(1, 1, 1);
    const decorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const decorCount = 110;
    const decor = new THREE.InstancedMesh(decorGeometry, decorMaterial, decorCount);
    const dummy = new THREE.Object3D();
    const decorColor = new THREE.Color();
    for (let i = 0; i < decorCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 17 + Math.random() * 38;
      const blockHeight = 1 + Math.random() * 5;
      dummy.position.set(Math.cos(angle) * radius, blockHeight / 2, Math.sin(angle) * radius);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.set(1 + Math.random() * 2.4, blockHeight, 1 + Math.random() * 2.4);
      dummy.updateMatrix();
      decor.setMatrixAt(i, dummy.matrix);
      decorColor.setHSL(0.55, 0.4, 0.05 + Math.random() * 0.06);
      decor.setColorAt(i, decorColor);
    }
    decor.instanceMatrix.needsUpdate = true;
    if (decor.instanceColor) decor.instanceColor.needsUpdate = true;
    scene.add(decor);

    /* ---------------- project blocks ---------------- */
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const textures = [];
    const screenCanvases = [];
    const blockGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const screenGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
    const edgeGeometry = new THREE.EdgesGeometry(blockGeometry);
    const blocks = [];
    const raycastTargets = [];

    const makeScreenTexture = (project, index) => {
      const accent = hexToCss(CATEGORY_HEX[categorize(project.tech)]);
      const screenCanvas = document.createElement("canvas");
      screenCanvas.width = SCREEN_W;
      screenCanvas.height = SCREEN_H;
      paintScreen(screenCanvas, project, accent, index, null);
      screenCanvases.push(screenCanvas);

      const texture = new THREE.CanvasTexture(screenCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = maxAnisotropy;
      textures.push(texture);

      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (disposed) return;
        paintScreen(screenCanvas, project, accent, index, image);
        texture.needsUpdate = true;
      };
      image.src = project.image;

      return texture;
    };

    let projectIndex = 0;
    ROWS.forEach((rowProjects, rowIndex) => {
      const y = 1.3 + rowIndex * ROW_GAP_Y;
      const z = WALL_Z - rowIndex * ROW_Z_STEP;
      rowProjects.forEach((project, columnIndex) => {
        const x = (columnIndex - (rowProjects.length - 1) / 2) * BLOCK_GAP_X;
        const category = categorize(project.tech);
        const accent = CATEGORY_HEX[category];
        const color = new THREE.Color(accent);

        const sideMaterial = new THREE.MeshLambertMaterial({
          color: color.clone().multiplyScalar(0.42),
          emissive: color.clone(),
          emissiveIntensity: 0,
        });
        const screenMaterial = new THREE.MeshBasicMaterial({
          map: makeScreenTexture(project, projectIndex),
        });

        const mesh = new THREE.Mesh(blockGeometry, sideMaterial);
        mesh.userData.projectIndex = projectIndex;

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.12, BLOCK_SIZE / 2 + 0.012);
        screen.userData.projectIndex = projectIndex;

        raycastTargets.push(mesh, screen);

        const edgeMaterial = new THREE.LineBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.35,
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.add(mesh, screen, edges);
        scene.add(group);

        blocks.push({
          group,
          mesh,
          screen,
          sideMaterial,
          screenMaterial,
          edgeMaterial,
          baseY: y,
          phase: projectIndex * 0.8,
          index: projectIndex,
          hoverAmount: 0,
        });
        projectIndex += 1;
      });
    });

    /* ---------------- input ---------------- */
    const keys = { forward: false, back: false, left: false, right: false, run: false };
    let verticalVelocity = 0;
    let grounded = true;

    const onKeyDown = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keys.forward = true;
          event.preventDefault();
          break;
        case "KeyS":
        case "ArrowDown":
          keys.back = true;
          event.preventDefault();
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.left = true;
          event.preventDefault();
          break;
        case "KeyD":
        case "ArrowRight":
          keys.right = true;
          event.preventDefault();
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.run = true;
          break;
        case "Space":
          event.preventDefault();
          if (grounded && !event.repeat) {
            verticalVelocity = 5.4;
            grounded = false;
          }
          break;
        case "Escape":
          if (panelOpenRef.current) {
            panelOpenRef.current = false;
            setPanelOpen(false);
          }
          break;
        default:
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keys.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.back = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.run = false;
          break;
        default:
          break;
      }
    };

    const pointer = new THREE.Vector2(0, 0);
    let dragging = false;
    let dragDistance = 0;
    let lastX = 0;
    let lastY = 0;

    const setPointerFromEvent = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
    };

    const raycaster = new THREE.Raycaster();
    raycaster.far = 40;

    const selectProject = (index) => {
      if (index === null) return;
      panelOpenRef.current = true;
      setSelectedIndex(index);
      setPanelOpen(true);
      if (document.pointerLockElement) document.exitPointerLock();
    };

    const pickAt = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(raycastTargets, false);
      return hits.length > 0 ? hits[0].object.userData.projectIndex : null;
    };

    const pickCenter = () => {
      const rect = canvas.getBoundingClientRect();
      return pickAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    const onPointerDown = (event) => {
      if (event.button !== 0 || document.pointerLockElement === canvas) return;
      dragging = true;
      dragDistance = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.style.cursor = "grabbing";
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is optional.
      }
    };

    const onPointerMove = (event) => {
      if (document.pointerLockElement === canvas) return;
      setPointerFromEvent(event);
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      yaw -= dx * 0.0045;
      pitch = THREE.MathUtils.clamp(pitch - dy * 0.0045, -1.15, 1.15);
    };

    const onPointerUp = (event) => {
      if (document.pointerLockElement === canvas) {
        selectProject(pickCenter());
        return;
      }
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (dragDistance > 8) return;
      selectProject(pickAt(event.clientX, event.clientY));
    };

    const onPointerLeave = () => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
    };

    const onLockedMouseMove = (event) => {
      if (document.pointerLockElement !== canvas) return;
      yaw -= event.movementX * 0.0022;
      pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.0022, -1.15, 1.15);
    };

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      setPointerLocked(locked);
      if (locked) setLockHint("");
    };

    const onPointerLockError = () => {
      setLockHint("Mouse lock is blocked here — drag on the world to look around.");
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("mousemove", onLockedMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("pointerlockerror", onPointerLockError);

    const resize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (!nextWidth || !nextHeight) return;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    /* ---------------- render loop ---------------- */
    const cameraForward = new THREE.Vector3();
    const cameraRight = new THREE.Vector3();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovered = -1;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsedTime = 0;

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      const frameTime = typeof now === "number" ? now : performance.now();
      const delta = Math.min((frameTime - lastTime) / 1000, 0.05);
      lastTime = frameTime;
      elapsedTime += delta;
      const elapsed = elapsedTime;

      if (!panelOpenRef.current) {
        if (keys.forward || keys.back || keys.left || keys.right) {
          cameraForward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
          cameraRight.set(Math.cos(yaw), 0, -Math.sin(yaw));
          const forwardAmount = Number(keys.forward) - Number(keys.back);
          const rightAmount = Number(keys.right) - Number(keys.left);
          const length = Math.hypot(forwardAmount, rightAmount) || 1;
          const speed = (keys.run ? 7.4 : 4.2) * delta;
          const moveX =
            (cameraForward.x * forwardAmount + cameraRight.x * rightAmount) / length;
          const moveZ =
            (cameraForward.z * forwardAmount + cameraRight.z * rightAmount) / length;
          camera.position.x = THREE.MathUtils.clamp(camera.position.x + moveX * speed, -32, 32);
          camera.position.z = THREE.MathUtils.clamp(camera.position.z + moveZ * speed, -32, 32);
        }

        verticalVelocity -= 17 * delta;
        camera.position.y += verticalVelocity * delta;
        if (camera.position.y <= EYE_HEIGHT) {
          camera.position.y = EYE_HEIGHT;
          verticalVelocity = 0;
          grounded = true;
        }
      }

      camera.rotation.set(pitch, yaw, 0);

      const locked = document.pointerLockElement === canvas;
      raycaster.setFromCamera(locked ? new THREE.Vector2(0, 0) : pointer, camera);
      const hits = panelOpenRef.current ? [] : raycaster.intersectObjects(raycastTargets, false);
      const nextHovered = hits.length > 0 ? hits[0].object.userData.projectIndex : -1;

      if (nextHovered !== hovered) {
        hovered = nextHovered;
        setHoveredIndex(nextHovered === -1 ? null : nextHovered);
        canvas.style.cursor = nextHovered === -1 ? "grab" : "pointer";
      }

      blocks.forEach((block) => {
        const targetHover = block.index === nextHovered ? 1 : 0;
        block.hoverAmount = THREE.MathUtils.lerp(block.hoverAmount, targetHover, 0.16);
        const bob = reducedMotion ? 0 : Math.sin(elapsed * 1.1 + block.phase) * 0.055;
        block.group.position.y = block.baseY + bob;
        block.group.scale.setScalar(1 + block.hoverAmount * 0.045);
        block.sideMaterial.emissiveIntensity = block.hoverAmount * 0.32;
        block.edgeMaterial.opacity = 0.35 + block.hoverAmount * 0.55;
      });

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    /* ---------------- teardown ---------------- */
    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();

      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("mousemove", onLockedMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("pointerlockerror", onPointerLockError);

      if (document.pointerLockElement === canvas) document.exitPointerLock();

      textures.forEach((texture) => texture.dispose());
      screenCanvases.forEach((screenCanvas) => {
        screenCanvas.width = 1;
        screenCanvas.height = 1;
      });
      blockGeometry.dispose();
      screenGeometry.dispose();
      edgeGeometry.dispose();
      blocks.forEach((block) => {
        block.sideMaterial.dispose();
        block.screenMaterial.dispose();
        block.edgeMaterial.dispose();
      });
      groundGeometry.dispose();
      groundMaterial.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      decorGeometry.dispose();
      decorMaterial.dispose();
      decor.dispose();

      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      if (canvasElRef.current === canvas) canvasElRef.current = null;
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Fallback: no WebGL2                                                */
  /* ------------------------------------------------------------------ */
  if (webglError) {
    return (
      <div className="min-h-[100dvh] bg-bg text-ink">
        <div className="mx-auto max-w-[1100px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
          <p className="label">Showcase</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">
            Project <span className="text-accent">World</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            This browser could not start WebGL, so the 3D voxel world is unavailable. The projects
            are still all here — pick one below.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.title}
                to={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-line bg-elev transition-colors hover:border-accent/60"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-bold tracking-[-0.02em] group-hover:text-accent">
                    {project.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  World                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[#05070a] text-white"
    >
      {/* HUD: title */}
      <div className="pointer-events-none absolute left-5 top-20 z-20 max-w-[280px] md:left-10 md:top-24">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-cyan-300/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
          Interactive showcase
        </p>
        <h1 className="mt-2 text-[clamp(1.6rem,3.2vw,2.3rem)] font-extrabold leading-none tracking-[-0.03em] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
          Project <span className="text-cyan-400">World</span>
        </h1>
      </div>

      {/* HUD: actions */}
      <div className="pointer-events-none absolute right-4 top-20 z-30 flex flex-col items-end gap-2 md:right-8 md:top-24">
        <button
          type="button"
          onClick={togglePointerLock}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#041016] transition-colors hover:bg-cyan-300"
        >
          <MousePointerClick className="size-4" aria-hidden="true" />
          {pointerLocked ? "Release mouse" : "Enter world"}
        </button>
        <Link
          to="/projects"
          className="pointer-events-auto rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[0.7rem] font-medium text-white/70 backdrop-blur transition-colors hover:border-cyan-400/50 hover:text-white"
        >
          Project grid
        </Link>
      </div>

      {/* HUD: crosshair */}
      {pointerLocked && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative h-5 w-5">
            <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-cyan-300" />
            <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-cyan-300" />
            <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-cyan-300" />
            <span className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-cyan-300" />
            <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300" />
          </div>
        </div>
      )}

      {/* HUD: bottom hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-16">
        <div className="max-w-full rounded-full border border-white/10 bg-black/55 px-4 py-2 text-center text-xs text-white/65 backdrop-blur">
          {hoveredIndex !== null ? (
            <span className="text-white">
              <span className="font-semibold text-cyan-300">Click</span> to open ·{" "}
              {projects[hoveredIndex].title}
            </span>
          ) : pointerLocked ? (
            <span>
              <Kbd>W</Kbd>
              <Kbd>A</Kbd>
              <Kbd>S</Kbd>
              <Kbd>D</Kbd> move · mouse to look · <Kbd>Esc</Kbd> release
            </span>
          ) : (
            <span>
              Drag to look · <Kbd>W</Kbd>
              <Kbd>A</Kbd>
              <Kbd>S</Kbd>
              <Kbd>D</Kbd> move · <Kbd>Space</Kbd> jump · click a block
            </span>
          )}
        </div>
        {lockHint && <p className="text-center text-[0.7rem] text-amber-300/90">{lockHint}</p>}
      </div>

      {/* Detail panel */}
      {panelOpen && selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <button
            type="button"
            aria-label="Close project details"
            onClick={closeProject}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            className="relative z-10 max-h-[88dvh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1220] text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest"
                style={{ color: hexToCss(CATEGORY_HEX[categorize(selectedProject.tech)]) }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: hexToCss(CATEGORY_HEX[categorize(selectedProject.tech)]) }}
                />
                {CATEGORY_LABEL[categorize(selectedProject.tech)]}
              </span>
              <button
                type="button"
                onClick={closeProject}
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-cyan-400/50 hover:text-white"
                aria-label="Close"
              >
                <ArrowUpRight className="size-4 rotate-180" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[1.05fr_1fr] md:gap-8 md:p-7">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
                  {selectedProject.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {selectedProject.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech, index) => (
                    <li
                      key={`${techLabel(tech)}-${index}`}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] text-white/70"
                    >
                      <img src={tech} alt="" className="size-4 object-contain" loading="lazy" decoding="async" />
                      {techLabel(tech)}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#041016] transition-colors hover:bg-cyan-300"
                  >
                    <Github className="size-4" aria-hidden="true" />
                    GitHub
                  </a>
                  {selectedProject.website && (
                    <a
                      href={selectedProject.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-cyan-400/60 hover:text-white"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      Live site
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Kbd = ({ children }) => (
  <kbd className="mx-0.5 inline-flex min-w-[1.35rem] items-center justify-center rounded border border-white/15 bg-white/10 px-1 py-0.5 font-mono text-[0.65rem] leading-none text-white/80">
    {children}
  </kbd>
);

export default Showcase;
