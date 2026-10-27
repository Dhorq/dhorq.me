import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp, ExternalLink, Github, MousePointerClick } from "lucide-react";
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
/*  Minecraft-style pixel textures                                     */
/* ------------------------------------------------------------------ */

const PIXEL_SIZE = 16;

const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pixelIndex = (rng, size = PIXEL_SIZE) => Math.floor(rng() * size);

const fillPixelNoise = (ctx, palette, rng) => {
  for (let y = 0; y < PIXEL_SIZE; y += 1) {
    for (let x = 0; x < PIXEL_SIZE; x += 1) {
      ctx.fillStyle = palette[pixelIndex(rng, palette.length)];
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

const pixelTexture = (seed, paint, anisotropy = 1) => {
  const canvas = document.createElement("canvas");
  canvas.width = PIXEL_SIZE;
  canvas.height = PIXEL_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  paint(ctx, mulberry32(seed));

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = anisotropy;
  return texture;
};

const makeMinecraftTextures = (anisotropy) => {
  const grassGreens = ["#5d9e3d", "#69ac45", "#538f35", "#75b94e", "#4c8431"];
  const dirtBrowns = ["#7c5437", "#8a5f3e", "#6f4a30", "#94694a", "#81583a"];

  const grassTop = pixelTexture(
    11,
    (ctx, rng) => {
      fillPixelNoise(ctx, grassGreens, rng);
      for (let i = 0; i < 30; i += 1) {
        ctx.fillStyle = rng() > 0.55 ? "#41752a" : "#86c95d";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1, 1);
      }
    },
    anisotropy,
  );

  const dirt = pixelTexture(
    22,
    (ctx, rng) => {
      fillPixelNoise(ctx, dirtBrowns, rng);
      for (let i = 0; i < 18; i += 1) {
        ctx.fillStyle = rng() > 0.5 ? "#5e3f28" : "#a07654";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1, 1);
      }
    },
    anisotropy,
  );

  const grassSide = pixelTexture(
    33,
    (ctx, rng) => {
      fillPixelNoise(ctx, dirtBrowns, rng);
      for (let x = 0; x < PIXEL_SIZE; x += 1) {
        let depth = 3;
        if (rng() < 0.45) depth += 1;
        if (rng() < 0.14) depth += 1;
        for (let y = 0; y < depth; y += 1) {
          ctx.fillStyle = grassGreens[pixelIndex(rng, grassGreens.length)];
          ctx.fillRect(x, y, 1, 1);
        }
        if (rng() < 0.55) {
          ctx.fillStyle = grassGreens[pixelIndex(rng, grassGreens.length)];
          ctx.fillRect(x, depth, 1, 1);
        }
      }
    },
    anisotropy,
  );

  const stone = pixelTexture(
    44,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#7b7b7b", "#858585", "#727272", "#8d8d8d", "#6c6c6c"], rng);
      for (let i = 0; i < 10; i += 1) {
        ctx.fillStyle = rng() > 0.5 ? "#5f5f5f" : "#999999";
        const x = pixelIndex(rng);
        const y = pixelIndex(rng);
        ctx.fillRect(x, y, 1 + Math.floor(rng() * 3), 1);
      }
    },
    anisotropy,
  );

  const cobble = pixelTexture(
    55,
    (ctx, rng) => {
      ctx.fillStyle = "#4f4f4f";
      ctx.fillRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
      const cells = [
        [0, 0, 7, 5],
        [8, 0, 8, 5],
        [0, 6, 5, 4],
        [6, 6, 10, 4],
        [0, 11, 8, 5],
        [9, 11, 7, 5],
      ];
      for (const [x, y, w, h] of cells) {
        ctx.fillStyle = ["#8a8a8a", "#7f7f7f", "#949494", "#767676"][pixelIndex(rng, 4)];
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fillRect(x, y, w, 1);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(x, y + h - 1, w, 1);
      }
    },
    anisotropy,
  );

  const planks = pixelTexture(
    66,
    (ctx, rng) => {
      const tones = ["#a97c4f", "#9a6f45", "#b08355", "#8f653e"];
      for (let row = 0; row < 4; row += 1) {
        const y = row * 4;
        ctx.fillStyle = tones[row % tones.length];
        ctx.fillRect(0, y, PIXEL_SIZE, 4);
        ctx.fillStyle = "#5c3d22";
        ctx.fillRect(0, y, PIXEL_SIZE, 1);
        for (let i = 0; i < 4; i += 1) {
          ctx.fillStyle = rng() > 0.5 ? "rgba(75,48,25,0.55)" : "rgba(201,154,105,0.35)";
          ctx.fillRect(pixelIndex(rng), y + 1 + pixelIndex(rng, 3), 1 + pixelIndex(rng, 3), 1);
        }
      }
      ctx.fillStyle = "#4e321b";
      ctx.fillRect(7, 0, 1, 4);
      ctx.fillRect(12, 8, 1, 4);
      ctx.fillRect(4, 4, 1, 4);
    },
    anisotropy,
  );

  const logSide = pixelTexture(
    77,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#5b3d22", "#67462a", "#4e341d", "#715034"], rng);
      for (let x = 0; x < PIXEL_SIZE; x += 2) {
        ctx.fillStyle = rng() > 0.5 ? "rgba(35,22,12,0.55)" : "rgba(150,110,70,0.22)";
        ctx.fillRect(x, 0, 1, PIXEL_SIZE);
      }
      for (let i = 0; i < 8; i += 1) {
        ctx.fillStyle = "rgba(25,15,8,0.45)";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1, 3 + pixelIndex(rng, 5));
      }
    },
    anisotropy,
  );

  const logTop = pixelTexture(
    88,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#b78c58", "#c39a67", "#a87f4d"], rng);
      ctx.strokeStyle = "#6f4a28";
      ctx.lineWidth = 1;
      ctx.strokeRect(3.5, 3.5, 9, 9);
      ctx.strokeRect(6.5, 6.5, 3, 3);
      ctx.fillStyle = "#76502c";
      ctx.fillRect(7, 7, 2, 2);
      for (let i = 0; i < 6; i += 1) {
        ctx.fillStyle = "rgba(90,58,30,0.5)";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1, 1);
      }
    },
    anisotropy,
  );

  const leaves = pixelTexture(
    99,
    (ctx, rng) => {
      ctx.clearRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
      const leafGreens = ["#3f7a2b", "#4b8a33", "#356b24", "#57a03c", "#2e5e20"];
      for (let y = 0; y < PIXEL_SIZE; y += 1) {
        for (let x = 0; x < PIXEL_SIZE; x += 1) {
          if (rng() < 0.16) continue;
          ctx.fillStyle = leafGreens[pixelIndex(rng, leafGreens.length)];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    },
    anisotropy,
  );

  const sand = pixelTexture(
    111,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#d9c98f", "#e3d49a", "#cdbd83", "#e9dda8"], rng);
      for (let i = 0; i < 14; i += 1) {
        ctx.fillStyle = rng() > 0.5 ? "#bfae74" : "#f2e7b8";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1, 1);
      }
    },
    anisotropy,
  );

  const water = pixelTexture(
    122,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#3f7fd6", "#4689dd", "#3672c5", "#4d93e8"], rng);
      for (let i = 0; i < 12; i += 1) {
        ctx.fillStyle = rng() > 0.5 ? "rgba(180,220,255,0.35)" : "rgba(28,70,150,0.35)";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 3 + pixelIndex(rng, 6), 1);
      }
    },
    anisotropy,
  );

  const path = pixelTexture(
    133,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#7d6a4f", "#8a775a", "#6f5d43", "#948062"], rng);
      for (let i = 0; i < 16; i += 1) {
        ctx.fillStyle = rng() > 0.5 ? "#5f6b55" : "#a59372";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1, 1);
      }
    },
    anisotropy,
  );

  const tallGrass = pixelTexture(
    144,
    (ctx, rng) => {
      ctx.clearRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
      for (let i = 0; i < 7; i += 1) {
        const x = 1 + pixelIndex(rng, 14);
        const height = 5 + pixelIndex(rng, 11);
        ctx.fillStyle = ["#4f8f34", "#5fa03f", "#3f7a2b"][pixelIndex(rng, 3)];
        ctx.fillRect(x, PIXEL_SIZE - height, 1, height);
        if (rng() > 0.5) ctx.fillRect(x + 1, PIXEL_SIZE - height + 2, 1, height - 2);
      }
    },
    anisotropy,
  );

  const flower = (seed, petal, center) =>
    pixelTexture(
      seed,
      (ctx, rng) => {
        ctx.clearRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
        const stemX = 7 + pixelIndex(rng, 2);
        ctx.fillStyle = "#3f7a2b";
        ctx.fillRect(stemX, 7, 1, 9);
        ctx.fillRect(stemX - 2, 10, 2, 1);
        ctx.fillRect(stemX + 1, 12, 2, 1);
        ctx.fillStyle = petal;
        ctx.fillRect(stemX - 1, 3, 3, 3);
        ctx.fillRect(stemX - 2, 4, 5, 1);
        ctx.fillStyle = center;
        ctx.fillRect(stemX, 4, 1, 1);
      },
      anisotropy,
    );

  const poppy = flower(155, "#cc3333", "#f2d16b");
  const dandelion = flower(166, "#e8c93f", "#f7e9a0");

  const stoneBricks = pixelTexture(
    177,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#7a7a7a", "#838383", "#717171", "#8c8c8c"], rng);
      ctx.fillStyle = "#4f4f4f";
      for (let y = 0; y < PIXEL_SIZE; y += 4) ctx.fillRect(0, y, PIXEL_SIZE, 1);
      for (let y = 0; y < PIXEL_SIZE; y += 4) {
        const offset = (y / 4) % 2 === 0 ? 0 : 4;
        ctx.fillRect(offset, y, 1, 4);
        ctx.fillRect((offset + 8) % 16, y, 1, 4);
      }
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      for (let y = 1; y < PIXEL_SIZE; y += 4) ctx.fillRect(0, y, PIXEL_SIZE, 1);
    },
    anisotropy,
  );

  const glowstone = pixelTexture(
    188,
    (ctx, rng) => {
      fillPixelNoise(ctx, ["#e9c15a", "#f0d273", "#d9ae45", "#f7e39a"], rng);
      for (let i = 0; i < 22; i += 1) {
        ctx.fillStyle = rng() > 0.5 ? "#b8892e" : "#fff3b8";
        ctx.fillRect(pixelIndex(rng), pixelIndex(rng), 1 + pixelIndex(rng, 2), 1);
      }
    },
    anisotropy,
  );

  return {
    grassTop,
    grassSide,
    dirt,
    stone,
    cobble,
    planks,
    logSide,
    logTop,
    leaves,
    sand,
    water,
    path,
    tallGrass,
    poppy,
    dandelion,
    stoneBricks,
    glowstone,
  };
};

const makeGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 246, 190, 0.95)");
  gradient.addColorStop(0.35, "rgba(255, 198, 80, 0.5)");
  gradient.addColorStop(1, "rgba(255, 166, 40, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

/* ------------------------------------------------------------------ */
/*  Mobile joystick                                                    */
/* ------------------------------------------------------------------ */

const VirtualJoystick = ({ onChange }) => {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const pointerRef = useRef(null);

  const update = (clientX, clientY) => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    const rect = base.getBoundingClientRect();
    const max = rect.width / 2 - 28;
    let dx = clientX - (rect.left + rect.width / 2);
    let dy = clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);

    if (distance > max) {
      dx = (dx / distance) * max;
      dy = (dy / distance) * max;
    }

    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    const x = dx / max;
    const y = dy / max;
    if (Math.hypot(x, y) < 0.14) onChange(0, 0);
    else onChange(x, y);
  };

  const reset = () => {
    const knob = knobRef.current;
    if (knob) {
      knob.style.transition = "transform 150ms ease-out";
      knob.style.transform = "translate(-50%, -50%)";
    }
    onChange(0, 0);
  };

  const end = (event) => {
    if (event.pointerId !== pointerRef.current) return;
    pointerRef.current = null;
    reset();
  };

  return (
    <div
      ref={baseRef}
      role="group"
      aria-label="Movement joystick"
      onPointerDown={(event) => {
        if (pointerRef.current !== null) return;
        event.preventDefault();
        pointerRef.current = event.pointerId;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is optional.
        }
        if (knobRef.current) knobRef.current.style.transition = "none";
        update(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.pointerId !== pointerRef.current) return;
        event.preventDefault();
        update(event.clientX, event.clientY);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
      onContextMenu={(event) => event.preventDefault()}
      className="pointer-events-auto relative size-32 touch-none select-none rounded-full border-2 border-white/25 bg-black/30 shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_2px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
    >
      <span className="pointer-events-none absolute inset-3 rounded-full border border-lime-200/20" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
      <div
        ref={knobRef}
        className="pointer-events-none absolute left-1/2 top-1/2 size-14 rounded-full border-2 border-lime-100/50 bg-[#79b34a] shadow-[inset_2px_2px_0_rgba(255,255,255,0.35),inset_-2px_-2px_0_rgba(0,0,0,0.3),0_0_24px_rgba(121,179,74,0.45)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/60 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
        Move
      </span>
    </div>
  );
};

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

const SCREEN_FRAME = 40;

const paintScreen = (canvas, project, accent, index, image) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0a1017";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  if (image) drawCover(ctx, image);

  const gradient = ctx.createLinearGradient(0, SCREEN_H * 0.34, 0, SCREEN_H);
  gradient.addColorStop(0, "rgba(4, 9, 14, 0)");
  gradient.addColorStop(0.55, "rgba(4, 9, 14, 0.72)");
  gradient.addColorStop(1, "rgba(4, 9, 14, 0.96)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Category tint strip, inset inside the wooden item frame.
  ctx.fillStyle = accent;
  ctx.fillRect(SCREEN_FRAME, SCREEN_FRAME, SCREEN_W - SCREEN_FRAME * 2, 7);

  // Index chip
  ctx.fillStyle = accent;
  ctx.fillRect(SCREEN_FRAME + 14, SCREEN_FRAME + 14, 72, 32);
  ctx.fillStyle = "#041016";
  ctx.font = "700 18px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index + 1).padStart(2, "0"), SCREEN_FRAME + 30, SCREEN_FRAME + 31);

  // Title
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 48px Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
  const innerWidth = SCREEN_W - SCREEN_FRAME * 2 - 28;
  const lines = wrapTitle(ctx, project.title, innerWidth).slice(0, 2);
  const startY = SCREEN_H - SCREEN_FRAME - 32 - (lines.length - 1) * 50;
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 16;
  lines.forEach((line, i) => {
    ctx.fillText(line, SCREEN_FRAME + 14, startY + i * 50);
  });
  ctx.shadowBlur = 0;

  // Chunky oak item-frame, drawn last so it crops the artwork cleanly.
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#6b4a2c";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_FRAME);
  ctx.fillRect(0, SCREEN_H - SCREEN_FRAME, SCREEN_W, SCREEN_FRAME);
  ctx.fillRect(0, 0, SCREEN_FRAME, SCREEN_H);
  ctx.fillRect(SCREEN_W - SCREEN_FRAME, 0, SCREEN_FRAME, SCREEN_H);

  ctx.fillStyle = "#3d2916";
  ctx.fillRect(0, 0, SCREEN_W, 6);
  ctx.fillRect(0, SCREEN_H - 6, SCREEN_W, 6);
  ctx.fillRect(0, 0, 6, SCREEN_H);
  ctx.fillRect(SCREEN_W - 6, 0, 6, SCREEN_H);
  ctx.fillRect(SCREEN_FRAME - 5, SCREEN_FRAME - 5, SCREEN_W - SCREEN_FRAME * 2 + 10, 5);
  ctx.fillRect(
    SCREEN_FRAME - 5,
    SCREEN_H - SCREEN_FRAME,
    SCREEN_W - SCREEN_FRAME * 2 + 10,
    5,
  );
  ctx.fillRect(SCREEN_FRAME - 5, SCREEN_FRAME - 5, 5, SCREEN_H - SCREEN_FRAME * 2 + 10);
  ctx.fillRect(
    SCREEN_W - SCREEN_FRAME,
    SCREEN_FRAME - 5,
    5,
    SCREEN_H - SCREEN_FRAME * 2 + 10,
  );

  ctx.fillStyle = "#8c6338";
  for (let x = 10; x < SCREEN_W; x += 48) {
    ctx.fillRect(x, 10, 20, 3);
    ctx.fillRect(x, SCREEN_H - 13, 20, 3);
  }
  for (let y = 10; y < SCREEN_H; y += 48) {
    ctx.fillRect(10, y, 3, 20);
    ctx.fillRect(SCREEN_W - 13, y, 3, 20);
  }

  ctx.fillStyle = "#2b1b0d";
  const studs = [
    [14, 14],
    [SCREEN_W - 26, 14],
    [14, SCREEN_H - 26],
    [SCREEN_W - 26, SCREEN_H - 26],
  ];
  studs.forEach(([x, y]) => {
    ctx.fillRect(x, y, 12, 12);
    ctx.fillStyle = "#a97c4d";
    ctx.fillRect(x + 3, y + 3, 6, 6);
    ctx.fillStyle = "#2b1b0d";
  });
  ctx.imageSmoothingEnabled = true;
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
const SCREEN_WIDTH = 1.96;
const SCREEN_HEIGHT = (SCREEN_WIDTH * SCREEN_H) / SCREEN_W;
const BLOCK_GAP_X = 3.05;
const ROW_GAP_Y = 2.5;
const WALL_Z = -7.8;
const ROW_Z_STEP = 0.7;
const EYE_HEIGHT = 1.62;
const WALK_BOUNDS = { minX: -15, maxX: 15, minZ: -5.5, maxZ: 12.5 };
const POND = { x: 9.5, z: 2.5, radius: 3.1 };

const Showcase = () => {
  const containerRef = useRef(null);
  const canvasElRef = useRef(null);
  const panelRef = useRef(null);
  const coordsRef = useRef(null);
  const panelOpenRef = useRef(false);
  const moveInputRef = useRef({ x: 0, y: 0 });
  const jumpInputRef = useRef(false);

  const [webglError, setWebglError] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [lockHint, setLockHint] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [touchMode] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches),
  );

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
    canvas.style.background = "#8ec9ff";
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
    renderer.setClearColor(0x8ec9ff, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ec9ff);
    scene.fog = new THREE.Fog(0x9fd4ff, 38, 108);

    const camera = new THREE.PerspectiveCamera(
      width / height < 0.85 ? 64 : 58,
      width / height,
      0.1,
      220,
    );
    camera.rotation.order = "YXZ";
    camera.position.set(0, EYE_HEIGHT, 8);
    let yaw = 0;
    let pitch = width / height < 0.85 ? 0.18 : 0.14;
    camera.rotation.set(pitch, yaw, 0);

    /* ---------------- shared pixel-art resources ---------------- */
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    const textures = makeMinecraftTextures(maxAnisotropy);
    const glowTexture = makeGlowTexture();
    const disposables = [];
    const track = (resource) => {
      disposables.push(resource);
      return resource;
    };
    Object.values(textures).forEach(track);
    track(glowTexture);

    const dummy = new THREE.Object3D();
    const placeInstance = (mesh, index, x, y, z, scaleX = 1, scaleY = 1, scaleZ = 1, rotationY = 0) => {
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotationY, 0);
      dummy.scale.set(scaleX, scaleY, scaleZ);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    };

    /* ---------------- Minecraft daylight ---------------- */
    const skyLight = new THREE.HemisphereLight(0xd8efff, 0x4d6f3a, 1.65);
    scene.add(skyLight);
    const sunLight = new THREE.DirectionalLight(0xfff3d8, 1.8);
    sunLight.position.set(26, 38, 18);
    scene.add(sunLight);
    const bounceLight = new THREE.DirectionalLight(0x9bd4ff, 0.3);
    bounceLight.position.set(-18, 10, -24);
    scene.add(bounceLight);

    const sunSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0xfff4b4,
        transparent: true,
        depthWrite: false,
        fog: false,
      }),
    );
    sunSprite.position.set(-38, 56, -80);
    sunSprite.scale.set(4.5, 4.5, 1);
    scene.add(sunSprite);

    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffe39a,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    );
    sunGlow.position.copy(sunSprite.position);
    sunGlow.scale.set(9, 9, 1);
    scene.add(sunGlow);

    /* ---------------- blocky clouds ---------------- */
    const cloudCount = 26;
    const cloudGeometry = track(new THREE.BoxGeometry(1, 1, 1));
    const cloudMaterial = track(
      new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }),
    );
    const clouds = new THREE.InstancedMesh(cloudGeometry, cloudMaterial, cloudCount);
    clouds.frustumCulled = false;
    const cloudData = [];
    const cloudRandom = mulberry32(9081);
    for (let i = 0; i < cloudCount; i += 1) {
      const data = {
        x: -72 + cloudRandom() * 144,
        y: 23 + cloudRandom() * 6,
        z: -82 + cloudRandom() * 100,
        sx: 4 + cloudRandom() * 9,
        sy: 1 + cloudRandom() * 1.2,
        sz: 2.5 + cloudRandom() * 4.5,
        speed: 0.35 + cloudRandom() * 0.4,
      };
      cloudData.push(data);
      placeInstance(clouds, i, data.x, data.y, data.z, data.sx, data.sy, data.sz);
    }
    clouds.instanceMatrix.needsUpdate = true;
    scene.add(clouds);

    /* ---------------- ocean ---------------- */
    const waterTexture = track(textures.water.clone());
    waterTexture.needsUpdate = true;
    waterTexture.repeat.set(70, 70);
    const oceanGeometry = track(new THREE.PlaneGeometry(240, 240));
    oceanGeometry.rotateX(-Math.PI / 2);
    const oceanMaterial = track(
      new THREE.MeshLambertMaterial({
        map: waterTexture,
        color: 0xbfe4ff,
        transparent: true,
        opacity: 0.88,
      }),
    );
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.position.set(0, -1.12, -2);
    scene.add(ocean);

    /* ---------------- voxel island ---------------- */
    const heights = new Map();
    const heightKey = (x, z) => `${x},${z}`;
    const flatZone = { minX: -15, maxX: 15, minZ: -14, maxZ: 13 };
    for (let x = -26; x <= 26; x += 1) {
      for (let z = -28; z <= 24; z += 1) {
        const distance = Math.hypot(x / 26, (z + 2) / 27);
        if (distance > 1.02) continue;

        let height = 0;
        if (distance > 0.8) {
          height = -1;
        } else {
          const hill =
            Math.sin(x * 0.31 + 1.6) * Math.cos(z * 0.27 - 0.4) +
            Math.sin((x + z) * 0.16 + 2.3) * 0.65;
          const edge = THREE.MathUtils.smoothstep(distance, 0.52, 0.8);
          height = Math.floor((hill * 0.5 + 0.5) * 2.4 * edge);
          if (height < 0) height = 0;
          if (
            x >= flatZone.minX &&
            x <= flatZone.maxX &&
            z >= flatZone.minZ &&
            z <= flatZone.maxZ
          ) {
            height = 0;
          }
          if (distance > 0.74) height = Math.min(height, 1);
          if (distance > 0.77) height = 0;
        }

        if (Math.hypot(x - POND.x, z - POND.z) < POND.radius) height = -1;
        heights.set(heightKey(x, z), height);
      }
    }

    const grassBlocks = [];
    const grassTops = [];
    const dirtBlocks = [];
    const sandBlocks = [];
    const sandTops = [];
    heights.forEach((height, key) => {
      const [x, z] = key.split(",").map(Number);
      const beach = height < 0;

      if (beach) {
        sandBlocks.push({ x, y: height - 0.5, z });
        sandTops.push({ x, y: height + 0.004, z });
      } else {
        grassBlocks.push({ x, y: height - 0.5, z });
        grassTops.push({ x, y: height + 0.004, z });
      }

      let lowestNeighbor = height;
      const neighbors = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      neighbors.forEach(([dx, dz]) => {
        const neighbor = heights.get(heightKey(x + dx, z + dz));
        lowestNeighbor = Math.min(lowestNeighbor, neighbor === undefined ? -2 : neighbor);
      });

      for (let level = height - 1; level > lowestNeighbor; level -= 1) {
        dirtBlocks.push({ x, y: level - 0.5, z });
      }
    });

    const blockGeometry = track(new THREE.BoxGeometry(1, 1, 1));
    const topGeometry = track(new THREE.PlaneGeometry(1, 1));
    topGeometry.rotateX(-Math.PI / 2);

    const grassBlockMaterial = track(new THREE.MeshLambertMaterial({ map: textures.grassSide }));
    const grassTopMaterial = track(new THREE.MeshLambertMaterial({ map: textures.grassTop }));
    const dirtMaterial = track(new THREE.MeshLambertMaterial({ map: textures.dirt }));
    const sandMaterial = track(new THREE.MeshLambertMaterial({ map: textures.sand }));
    const sandTopMaterial = track(new THREE.MeshLambertMaterial({ map: textures.sand }));

    const buildInstancedBlocks = (entries, geometry, material) => {
      if (!entries.length) return null;
      const mesh = new THREE.InstancedMesh(geometry, material, entries.length);
      mesh.frustumCulled = false;
      entries.forEach((entry, index) => {
        placeInstance(mesh, index, entry.x, entry.y, entry.z);
      });
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
      return mesh;
    };

    buildInstancedBlocks(grassBlocks, blockGeometry, grassBlockMaterial);
    buildInstancedBlocks(grassTops, topGeometry, grassTopMaterial);
    buildInstancedBlocks(dirtBlocks, blockGeometry, dirtMaterial);
    buildInstancedBlocks(sandBlocks, blockGeometry, sandMaterial);
    buildInstancedBlocks(sandTops, topGeometry, sandTopMaterial);

    // A small pond with its own animated surface.
    const pondTexture = track(textures.water.clone());
    pondTexture.needsUpdate = true;
    pondTexture.repeat.set(6, 6);
    const pondGeometry = track(new THREE.PlaneGeometry(5.7, 5.7));
    pondGeometry.rotateX(-Math.PI / 2);
    const pondMaterial = track(
      new THREE.MeshLambertMaterial({
        map: pondTexture,
        color: 0xc8e8ff,
        transparent: true,
        opacity: 0.92,
      }),
    );
    const pond = new THREE.Mesh(pondGeometry, pondMaterial);
    pond.position.set(POND.x, -0.72, POND.z);
    scene.add(pond);

    /* ---------------- dirt path ---------------- */
    const pathEntries = [];
    for (let z = 13; z >= -5.5; z -= 1) {
      const x = Math.round(Math.sin((z + 2) * 0.42) * 1.5);
      pathEntries.push({ x, z });
      if (Math.abs(z) % 5 < 1) pathEntries.push({ x: x + 1, z });
    }
    const pathMaterial = track(new THREE.MeshLambertMaterial({ map: textures.path }));
    const pathMesh = new THREE.InstancedMesh(topGeometry, pathMaterial, pathEntries.length);
    pathMesh.frustumCulled = false;
    pathEntries.forEach((entry, index) => {
      placeInstance(pathMesh, index, entry.x, 0.012, entry.z);
    });
    pathMesh.instanceMatrix.needsUpdate = true;
    scene.add(pathMesh);

    /* ---------------- oak trees ---------------- */
    const trunkEntries = [];
    const leafEntries = [];
    const leafKeys = new Set();
    const treeColliders = [];
    const treeRandom = mulberry32(5150);
    const treeSpots = [
      [-13.5, 6.5],
      [13.5, 7],
      [-17, -4],
      [17, -3],
      [-10, -13],
      [11, -14],
      [-6, -18],
      [7, -18],
      [-14, 12],
      [14, 12],
    ];

    treeSpots.forEach(([x, z]) => {
      const base = heights.get(heightKey(x, z));
      if (base === undefined || base < 0) return;
      if (Math.hypot(x - POND.x, z - POND.z) < POND.radius + 2.5) return;

      const trunkHeight = 4 + Math.floor(treeRandom() * 3);
      for (let i = 0; i < trunkHeight; i += 1) {
        trunkEntries.push({ x, y: base + 0.5 + i, z });
      }

      const top = base + trunkHeight;
      for (let layer = 0; layer < 3; layer += 1) {
        const radius = layer === 2 ? 1 : 2;
        for (let dx = -radius; dx <= radius; dx += 1) {
          for (let dz = -radius; dz <= radius; dz += 1) {
            if (layer === 2 && Math.abs(dx) + Math.abs(dz) > 1) continue;
            if (
              layer < 2 &&
              Math.abs(dx) === radius &&
              Math.abs(dz) === radius &&
              treeRandom() < 0.7
            ) {
              continue;
            }
            const leafX = x + dx;
            const leafY = top - 1.5 + layer;
            const leafZ = z + dz;
            const leafKey = `${leafX},${leafY},${leafZ}`;
            if (leafKeys.has(leafKey)) continue;
            leafKeys.add(leafKey);
            leafEntries.push({ x: leafX, y: leafY, z: leafZ });
          }
        }
      }
      treeColliders.push({ x, z, radius: 0.7 });
    });

    const logMaterial = track(new THREE.MeshLambertMaterial({ map: textures.logSide }));
    const trunkMesh = new THREE.InstancedMesh(blockGeometry, logMaterial, trunkEntries.length);
    trunkMesh.frustumCulled = false;
    trunkEntries.forEach((entry, index) => {
      placeInstance(trunkMesh, index, entry.x, entry.y, entry.z);
    });
    trunkMesh.instanceMatrix.needsUpdate = true;
    scene.add(trunkMesh);

    const leavesMaterial = track(
      new THREE.MeshLambertMaterial({
        map: textures.leaves,
        alphaTest: 0.5,
        side: THREE.FrontSide,
      }),
    );
    const leavesMesh = new THREE.InstancedMesh(blockGeometry, leavesMaterial, leafEntries.length);
    leavesMesh.frustumCulled = false;
    leafEntries.forEach((entry, index) => {
      placeInstance(leavesMesh, index, entry.x, entry.y, entry.z);
    });
    leavesMesh.instanceMatrix.needsUpdate = true;
    scene.add(leavesMesh);

    /* ---------------- wild grass and flowers ---------------- */
    const plantRandom = mulberry32(2718);
    const grassPlants = [];
    const flowerPlants = [];
    for (let i = 0; i < 180; i += 1) {
      const x = -14 + plantRandom() * 28;
      const z = -5 + plantRandom() * 17;
      const pathX = Math.sin((z + 2) * 0.42) * 1.5;
      if (Math.abs(x - pathX) < 1.3) continue;
      if (Math.hypot(x - POND.x, z - POND.z) < POND.radius + 0.4) continue;
      if (Math.hypot(x, z - 4.6) < 2) continue;

      const ground = heights.get(heightKey(Math.round(x), Math.round(z)));
      if (ground === undefined || ground < 0) continue;

      if (plantRandom() < 0.78) {
        grassPlants.push({ x, y: ground, z, scale: 0.7 + plantRandom() * 0.35 });
      } else {
        flowerPlants.push({
          x,
          y: ground,
          z,
          scale: 0.5 + plantRandom() * 0.2,
          red: plantRandom() < 0.55,
        });
      }
    }

    // The topGeometry is horizontal; plants need a vertical plane.
    const plantGeometry = track(new THREE.PlaneGeometry(1, 1));

    const plantMaterial = (texture) =>
      track(
        new THREE.MeshLambertMaterial({
          map: texture,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
        }),
      );

    const makePlants = (entries, texture) => {
      if (!entries.length) return;
      const mesh = new THREE.InstancedMesh(plantGeometry, plantMaterial(texture), entries.length * 2);
      mesh.frustumCulled = false;
      entries.forEach((entry, index) => {
        [0, Math.PI / 2].forEach((rotation, side) => {
          dummy.position.set(entry.x, entry.y + entry.scale / 2, entry.z);
          dummy.rotation.set(0, rotation, 0);
          dummy.scale.set(entry.scale, entry.scale, entry.scale);
          dummy.updateMatrix();
          mesh.setMatrixAt(index * 2 + side, dummy.matrix);
        });
      });
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
    };

    makePlants(grassPlants, textures.tallGrass);
    makePlants(
      flowerPlants.filter((flower) => flower.red),
      textures.poppy,
    );
    makePlants(
      flowerPlants.filter((flower) => !flower.red),
      textures.dandelion,
    );

    // Lily pads on the pond.
    const lilyMaterial = track(new THREE.MeshLambertMaterial({ color: 0x3f7a2b }));
    const lilyGeometry = track(new THREE.BoxGeometry(0.72, 0.03, 0.72));
    [
      [POND.x - 1.2, POND.z + 0.8, 0.4],
      [POND.x + 1.1, POND.z - 0.7, -0.3],
      [POND.x - 0.2, POND.z - 1.4, 0.9],
    ].forEach(([x, z, rotation]) => {
      const lily = new THREE.Mesh(lilyGeometry, lilyMaterial);
      lily.position.set(x, -0.7, z);
      lily.rotation.y = rotation;
      scene.add(lily);
    });

    /* ---------------- oak fence ---------------- */
    const woodMaterial = track(new THREE.MeshLambertMaterial({ map: textures.planks }));
    const fencePostGeometry = track(new THREE.BoxGeometry(0.18, 1, 0.18));
    const fenceRailGeometry = track(new THREE.BoxGeometry(0.14, 0.14, 2));
    const fencePosts = [0, 2, 4, 6, 8].map((z) => ({ x: -4.6, y: 0.5, z }));
    const fencePostsMesh = new THREE.InstancedMesh(
      fencePostGeometry,
      woodMaterial,
      fencePosts.length,
    );
    fencePosts.forEach((post, index) => {
      placeInstance(fencePostsMesh, index, post.x, post.y, post.z);
    });
    fencePostsMesh.instanceMatrix.needsUpdate = true;
    scene.add(fencePostsMesh);

    const fenceRails = [];
    [0, 2, 4, 6].forEach((z) => {
      fenceRails.push({ x: -4.6, y: 0.74, z: z + 1 });
      fenceRails.push({ x: -4.6, y: 0.44, z: z + 1 });
    });
    const fenceRailsMesh = new THREE.InstancedMesh(
      fenceRailGeometry,
      woodMaterial,
      fenceRails.length,
    );
    fenceRails.forEach((rail, index) => {
      placeInstance(fenceRailsMesh, index, rail.x, rail.y, rail.z);
    });
    fenceRailsMesh.instanceMatrix.needsUpdate = true;
    scene.add(fenceRailsMesh);

    /* ---------------- gallery pavilion ---------------- */
    const pavilion = new THREE.Group();
    scene.add(pavilion);

    const wallTexture = track(textures.planks.clone());
    wallTexture.needsUpdate = true;
    wallTexture.repeat.set(10, 4);
    const wallMaterial = track(new THREE.MeshLambertMaterial({ map: wallTexture }));
    const wallGeometry = track(new THREE.PlaneGeometry(19.4, 8.4));
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 4.2, -10.72);
    pavilion.add(backWall);

    const stoneBrickMaterial = track(
      new THREE.MeshLambertMaterial({ map: textures.stoneBricks }),
    );
    const foundationGeometry = track(new THREE.BoxGeometry(20.2, 0.9, 1.1));
    const foundation = new THREE.Mesh(foundationGeometry, stoneBrickMaterial);
    foundation.position.set(0, 0.45, -10.52);
    pavilion.add(foundation);

    const postGeometry = track(new THREE.BoxGeometry(0.78, 8.4, 0.78));
    const beamGeometry = track(new THREE.BoxGeometry(20.8, 0.78, 0.78));
    const logMaterialForPosts = track(new THREE.MeshLambertMaterial({ map: textures.logSide }));
    [-9.9, 9.9].forEach((x) => {
      const post = new THREE.Mesh(postGeometry, logMaterialForPosts);
      post.position.set(x, 4.2, -10.35);
      pavilion.add(post);
    });
    const topBeam = new THREE.Mesh(beamGeometry, logMaterialForPosts);
    topBeam.position.set(0, 8.25, -10.35);
    pavilion.add(topBeam);

    const roofMaterial = track(
      new THREE.MeshLambertMaterial({ map: textures.planks, color: 0x8c6a49 }),
    );
    const roofGeometry = track(new THREE.BoxGeometry(21.8, 0.5, 5.7));
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 8.7, -8.1);
    pavilion.add(roof);
    const roofTrimGeometry = track(new THREE.BoxGeometry(22.2, 0.22, 6));
    const roofTrim = new THREE.Mesh(roofTrimGeometry, roofMaterial);
    roofTrim.position.set(0, 8.98, -8.1);
    pavilion.add(roofTrim);

    // A few leaves growing over the pavilion roof.
    const roofLeafEntries = [];
    const roofLeafRandom = mulberry32(8181);
    for (let i = 0; i < 12; i += 1) {
      roofLeafEntries.push({
        x: -10.4 + roofLeafRandom() * 20.8,
        y: 9.08,
        z: -10.2 + roofLeafRandom() * 4.6,
      });
    }
    const roofLeaves = new THREE.InstancedMesh(
      blockGeometry,
      leavesMaterial,
      roofLeafEntries.length,
    );
    roofLeafEntries.forEach((entry, index) => {
      placeInstance(roofLeaves, index, entry.x, entry.y, entry.z);
    });
    roofLeaves.instanceMatrix.needsUpdate = true;
    pavilion.add(roofLeaves);

    // Hand-painted wooden sign hanging from the front roof edge.
    const signBoardGeometry = track(new THREE.BoxGeometry(7.3, 1.3, 0.18));
    const signBoardMaterial = track(new THREE.MeshLambertMaterial({ map: textures.logSide }));
    const signBoard = new THREE.Mesh(signBoardGeometry, signBoardMaterial);
    signBoard.position.set(0, 7.98, -5.5);
    pavilion.add(signBoard);

    const signCanvas = document.createElement("canvas");
    signCanvas.width = 640;
    signCanvas.height = 128;
    const signCtx = signCanvas.getContext("2d");
    if (signCtx) {
      signCtx.fillStyle = "#75512e";
      signCtx.fillRect(0, 0, 640, 128);
      signCtx.fillStyle = "#5a3c20";
      for (let y = 0; y < 128; y += 16) signCtx.fillRect(0, y, 640, 3);
      signCtx.fillStyle = "#a87a4a";
      signCtx.fillRect(8, 8, 624, 4);
      signCtx.fillRect(8, 116, 624, 4);
      signCtx.fillRect(8, 8, 4, 112);
      signCtx.fillRect(628, 8, 4, 112);
      signCtx.fillStyle = "#2d1c0d";
      for (const [x, y] of [
        [18, 18],
        [610, 18],
        [18, 100],
        [610, 100],
      ]) {
        signCtx.fillRect(x, y, 12, 12);
      }
      signCtx.textAlign = "center";
      signCtx.textBaseline = "middle";
      signCtx.fillStyle = "#f5e7c5";
      signCtx.shadowColor = "rgba(0,0,0,0.5)";
      signCtx.shadowOffsetY = 4;
      signCtx.font = "700 54px ui-monospace, SFMono-Regular, Menlo, monospace";
      signCtx.fillText("PROJECT GALLERY", 320, 56);
      signCtx.shadowOffsetY = 0;
      signCtx.fillStyle = "#d8c097";
      signCtx.font = "700 18px ui-monospace, SFMono-Regular, Menlo, monospace";
      signCtx.fillText("CLICK A BLOCK TO OPEN", 320, 96);
    }
    const signTexture = track(new THREE.CanvasTexture(signCanvas));
    signTexture.colorSpace = THREE.SRGBColorSpace;
    signTexture.magFilter = THREE.NearestFilter;
    signTexture.minFilter = THREE.LinearMipmapLinearFilter;
    const signMaterial = track(new THREE.MeshBasicMaterial({ map: signTexture }));
    const signGeometry = track(new THREE.PlaneGeometry(6.8, 1.05));
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 7.98, -5.39);
    pavilion.add(sign);

    // Hanging lanterns at the outside edges of the roof.
    const glowstoneMaterial = track(
      new THREE.MeshBasicMaterial({ map: textures.glowstone }),
    );
    const chainMaterial = track(new THREE.MeshLambertMaterial({ color: 0x2f2a25 }));
    const lanternGeometry = track(new THREE.BoxGeometry(0.4, 0.5, 0.4));
    const chainGeometry = track(new THREE.BoxGeometry(0.06, 0.9, 0.06));
    const flickerGlows = [];
    [-9.5, 9.5].forEach((x, index) => {
      const chain = new THREE.Mesh(chainGeometry, chainMaterial);
      chain.position.set(x, 8.05, -6.1);
      pavilion.add(chain);
      const lantern = new THREE.Mesh(lanternGeometry, glowstoneMaterial);
      lantern.position.set(x, 7.45, -6.1);
      pavilion.add(lantern);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0xffcc66,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      glow.position.set(x, 7.45, -6.1);
      glow.scale.set(2.4, 2.4, 1);
      pavilion.add(glow);
      flickerGlows.push({ sprite: glow, phase: index * 1.7, base: 0.48 });
    });

    /* ---------------- path torches ---------------- */
    const torchStickGeometry = track(new THREE.BoxGeometry(0.14, 0.58, 0.14));
    const torchFlameGeometry = track(new THREE.BoxGeometry(0.18, 0.18, 0.18));
    const torchFlameMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffb347 }));
    const torchSpots = [
      [-3.5, 1.5],
      [3.5, 1.5],
      [-3.5, -2.5],
      [3.5, -2.5],
    ];
    torchSpots.forEach(([x, z], index) => {
      const stick = new THREE.Mesh(torchStickGeometry, woodMaterial);
      stick.position.set(x, 0.29, z);
      scene.add(stick);
      const flame = new THREE.Mesh(torchFlameGeometry, torchFlameMaterial);
      flame.position.set(x, 0.63, z);
      scene.add(flame);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0xffba55,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      glow.position.set(x, 0.64, z);
      glow.scale.set(1.7, 1.7, 1);
      scene.add(glow);
      flickerGlows.push({ sprite: glow, phase: index * 1.3, base: 0.5 });
    });

    /* ---------------- blocky animals ---------------- */
    const animalBox = track(new THREE.BoxGeometry(1, 1, 1));
    const animalMaterials = {
      pink: track(new THREE.MeshLambertMaterial({ color: 0xe7a6a1 })),
      pinkDark: track(new THREE.MeshLambertMaterial({ color: 0xc9837e })),
      black: track(new THREE.MeshLambertMaterial({ color: 0x201c1a })),
      white: track(new THREE.MeshLambertMaterial({ color: 0xe9e5dd })),
      grey: track(new THREE.MeshLambertMaterial({ color: 0x49433f })),
      hoof: track(new THREE.MeshLambertMaterial({ color: 0x6b4a3a })),
    };
    const addAnimalBox = (group, material, size, position) => {
      const mesh = new THREE.Mesh(animalBox, material);
      mesh.scale.set(size[0], size[1], size[2]);
      mesh.position.set(position[0], position[1], position[2]);
      group.add(mesh);
      return mesh;
    };

    const buildPig = () => {
      const group = new THREE.Group();
      addAnimalBox(group, animalMaterials.pink, [1.2, 0.72, 0.76], [0, 0.78, 0]);
      const head = new THREE.Group();
      head.position.set(0, 0.92, 0.48);
      addAnimalBox(head, animalMaterials.pink, [0.66, 0.62, 0.56], [0, 0, 0]);
      addAnimalBox(head, animalMaterials.pinkDark, [0.34, 0.25, 0.16], [0, -0.09, 0.34]);
      addAnimalBox(head, animalMaterials.black, [0.07, 0.09, 0.05], [-0.2, 0.08, 0.29]);
      addAnimalBox(head, animalMaterials.black, [0.07, 0.09, 0.05], [0.2, 0.08, 0.29]);
      addAnimalBox(head, animalMaterials.pink, [0.16, 0.2, 0.1], [-0.3, 0.31, 0]);
      addAnimalBox(head, animalMaterials.pink, [0.16, 0.2, 0.1], [0.3, 0.31, 0]);
      group.add(head);
      [
        [-0.38, 0.29, 0.24],
        [0.38, 0.29, 0.24],
        [-0.38, 0.29, -0.24],
        [0.38, 0.29, -0.24],
      ].forEach(([x, y, z]) => {
        addAnimalBox(group, animalMaterials.pinkDark, [0.23, 0.58, 0.23], [x, y, z]);
      });
      addAnimalBox(group, animalMaterials.pinkDark, [0.12, 0.12, 0.24], [0, 0.92, -0.46]);
      return { group, head, baseHead: 0, phase: 0.4 };
    };

    const buildSheep = () => {
      const group = new THREE.Group();
      addAnimalBox(group, animalMaterials.white, [1.24, 0.86, 0.82], [0, 0.86, 0]);
      const head = new THREE.Group();
      head.position.set(0, 0.95, 0.52);
      addAnimalBox(head, animalMaterials.grey, [0.56, 0.58, 0.5], [0, 0, 0]);
      addAnimalBox(head, animalMaterials.black, [0.07, 0.09, 0.05], [-0.17, 0.1, 0.26]);
      addAnimalBox(head, animalMaterials.black, [0.07, 0.09, 0.05], [0.17, 0.1, 0.26]);
      addAnimalBox(head, animalMaterials.white, [0.18, 0.18, 0.12], [-0.31, 0.25, 0]);
      addAnimalBox(head, animalMaterials.white, [0.18, 0.18, 0.12], [0.31, 0.25, 0]);
      group.add(head);
      [
        [-0.4, 0.3, 0.27],
        [0.4, 0.3, 0.27],
        [-0.4, 0.3, -0.27],
        [0.4, 0.3, -0.27],
      ].forEach(([x, y, z]) => {
        addAnimalBox(group, animalMaterials.grey, [0.22, 0.6, 0.22], [x, y, z]);
      });
      return { group, head, baseHead: 0, phase: 2.1 };
    };

    const animalActors = [];
    const pig = buildPig();
    pig.group.position.set(-7.2, 0, -3.2);
    pig.group.rotation.y = 0.65;
    scene.add(pig.group);
    animalActors.push(pig);

    const sheep = buildSheep();
    sheep.group.position.set(7.2, 0, -3.8);
    sheep.group.rotation.y = -0.8;
    scene.add(sheep.group);
    animalActors.push(sheep);

    /* ---------------- project blocks ---------------- */
    const screenCanvases = [];
    const projectBlockGeometry = track(new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE));
    const projectTopGeometry = track(new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE));
    projectTopGeometry.rotateX(-Math.PI / 2);
    const screenGeometry = track(new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT));
    const edgeGeometry = track(new THREE.EdgesGeometry(projectBlockGeometry));
    const blocks = [];
    const raycastTargets = [];
    const projectSkins = {
      frontend: { side: textures.grassSide, top: textures.grassTop },
      backend: { side: textures.planks, top: textures.planks },
      data: { side: textures.stone, top: textures.stoneBricks },
      devops: { side: textures.cobble, top: textures.stone },
      default: { side: textures.dirt, top: textures.grassTop },
    };

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
      track(texture);

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
      const y = 1.1 + rowIndex * ROW_GAP_Y;
      const z = WALL_Z - rowIndex * ROW_Z_STEP;
      rowProjects.forEach((project, columnIndex) => {
        const x = (columnIndex - (rowProjects.length - 1) / 2) * BLOCK_GAP_X;
        const category = categorize(project.tech);
        const accent = CATEGORY_HEX[category];
        const color = new THREE.Color(accent);
        const skin = projectSkins[category] ?? projectSkins.default;

        const sideMaterial = track(
          new THREE.MeshLambertMaterial({
            map: skin.side,
            emissive: color.clone(),
            emissiveIntensity: 0,
          }),
        );
        const topMaterial = track(new THREE.MeshLambertMaterial({ map: skin.top }));
        const screenMaterial = track(
          new THREE.MeshBasicMaterial({
            map: makeScreenTexture(project, projectIndex),
          }),
        );

        const mesh = new THREE.Mesh(projectBlockGeometry, sideMaterial);
        mesh.userData.projectIndex = projectIndex;

        // One extra top plane keeps the block sides cheap while still giving
        // the project blocks a proper grass/plank/stone top face.
        const top = new THREE.Mesh(projectTopGeometry, topMaterial);
        top.position.set(0, BLOCK_SIZE / 2 + 0.002, 0);

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.12, BLOCK_SIZE / 2 + 0.012);
        screen.userData.projectIndex = projectIndex;

        raycastTargets.push(mesh, screen);

        const edgeMaterial = track(
          new THREE.LineBasicMaterial({
            color: 0x141414,
            transparent: true,
            opacity: 0,
          }),
        );
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.add(mesh, top, screen, edges);
        scene.add(group);

        blocks.push({
          group,
          mesh,
          screen,
          sideMaterial,
          screenMaterial,
          edgeMaterial,
          baseY: y,
          baseZ: z,
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
            verticalVelocity = 6.2;
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
    let lookPointerId = null;
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
      if (lookPointerId !== null) return;
      dragging = true;
      lookPointerId = event.pointerId;
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
      if (!dragging || event.pointerId !== lookPointerId) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      const sensitivity = event.pointerType === "touch" ? 0.006 : 0.0045;
      yaw -= dx * sensitivity;
      pitch = THREE.MathUtils.clamp(pitch - dy * sensitivity, -1.15, 1.15);
    };

    const onPointerUp = (event) => {
      if (document.pointerLockElement === canvas) {
        selectProject(pickCenter());
        return;
      }
      if (!dragging || event.pointerId !== lookPointerId) return;
      dragging = false;
      lookPointerId = null;
      canvas.style.cursor = "grab";
      if (dragDistance > (event.pointerType === "touch" ? 14 : 8)) return;
      selectProject(pickAt(event.clientX, event.clientY));
    };

    const onPointerLeave = () => {
      if (!dragging) return;
      dragging = false;
      lookPointerId = null;
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
    const coarsePointer = window.matchMedia("(pointer: coarse), (hover: none)").matches;
    let hovered = -1;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsedTime = 0;
    let hudTimer = 0;

    const canStand = (x, z) => {
      if (
        x < WALK_BOUNDS.minX ||
        x > WALK_BOUNDS.maxX ||
        z < WALK_BOUNDS.minZ ||
        z > WALK_BOUNDS.maxZ
      ) {
        return false;
      }
      if (Math.hypot(x - POND.x, z - POND.z) < POND.radius) return false;
      if (Math.abs(x + 4.6) < 0.42 && z > -0.5 && z < 8.5) return false;
      if (Math.hypot(x + 7.2, z + 3.2) < 0.9) return false;
      if (Math.hypot(x - 7.2, z + 3.8) < 0.9) return false;
      return !treeColliders.some((tree) => Math.hypot(x - tree.x, z - tree.z) < tree.radius);
    };

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      const frameTime = typeof now === "number" ? now : performance.now();
      const delta = Math.min((frameTime - lastTime) / 1000, 0.05);
      lastTime = frameTime;
      elapsedTime += delta;
      const elapsed = elapsedTime;

      if (!panelOpenRef.current) {
        const joystick = moveInputRef.current;
        const rawForward = Number(keys.forward) - Number(keys.back) - joystick.y;
        const rawRight = Number(keys.right) - Number(keys.left) + joystick.x;
        const rawLength = Math.hypot(rawForward, rawRight);

        if (rawLength > 0.01) {
          const intensity = Math.min(rawLength, 1);
          const scale = intensity / rawLength;
          cameraForward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
          cameraRight.set(Math.cos(yaw), 0, -Math.sin(yaw));
          const speed = (keys.run ? 7 : 4) * delta;
          const moveX = (cameraForward.x * rawForward + cameraRight.x * rawRight) * scale;
          const moveZ = (cameraForward.z * rawForward + cameraRight.z * rawRight) * scale;
          const nextX = camera.position.x + moveX * speed;
          if (canStand(nextX, camera.position.z)) camera.position.x = nextX;
          const nextZ = camera.position.z + moveZ * speed;
          if (canStand(camera.position.x, nextZ)) camera.position.z = nextZ;
        }

        if (jumpInputRef.current) {
          jumpInputRef.current = false;
          if (grounded) {
            verticalVelocity = 6.2;
            grounded = false;
          }
        }

        verticalVelocity -= 20 * delta;
        camera.position.y += verticalVelocity * delta;
        if (camera.position.y <= EYE_HEIGHT) {
          camera.position.y = EYE_HEIGHT;
          verticalVelocity = 0;
          grounded = true;
        }
      } else {
        jumpInputRef.current = false;
      }

      camera.rotation.set(pitch, yaw, 0);

      const locked = document.pointerLockElement === canvas;
      raycaster.setFromCamera(locked ? new THREE.Vector2(0, 0) : pointer, camera);
      const hits =
        coarsePointer || panelOpenRef.current
          ? []
          : raycaster.intersectObjects(raycastTargets, false);
      const nextHovered = hits.length > 0 ? hits[0].object.userData.projectIndex : -1;

      if (nextHovered !== hovered) {
        hovered = nextHovered;
        setHoveredIndex(nextHovered === -1 ? null : nextHovered);
        canvas.style.cursor = nextHovered === -1 ? "grab" : "pointer";
      }

      blocks.forEach((block) => {
        const targetHover = block.index === nextHovered ? 1 : 0;
        block.hoverAmount = THREE.MathUtils.lerp(block.hoverAmount, targetHover, 0.16);
        block.group.position.y = block.baseY;
        block.group.position.z = block.baseZ + block.hoverAmount * 0.08;
        block.group.scale.setScalar(1 + block.hoverAmount * 0.03);
        block.sideMaterial.emissiveIntensity = block.hoverAmount * 0.28;
        block.edgeMaterial.opacity = block.hoverAmount * 0.8;
      });

      if (!reducedMotion) {
        waterTexture.offset.x = (waterTexture.offset.x + delta * 0.004) % 1;
        waterTexture.offset.y = (waterTexture.offset.y + delta * 0.0015) % 1;
        pondTexture.offset.x = (pondTexture.offset.x - delta * 0.012) % 1;
        pondTexture.offset.y = (pondTexture.offset.y + delta * 0.006) % 1;

        cloudData.forEach((cloud, index) => {
          cloud.x += cloud.speed * delta;
          if (cloud.x > 78) cloud.x = -78;
          placeInstance(clouds, index, cloud.x, cloud.y, cloud.z, cloud.sx, cloud.sy, cloud.sz);
        });
        clouds.instanceMatrix.needsUpdate = true;

        animalActors.forEach((actor) => {
          actor.head.rotation.y = Math.sin(elapsed * 0.7 + actor.phase) * 0.26;
        });
      }

      flickerGlows.forEach((glow) => {
        glow.sprite.material.opacity = glow.base + Math.sin(elapsed * 7 + glow.phase) * 0.06;
      });

      hudTimer += delta;
      if (hudTimer > 0.2 && coordsRef.current) {
        hudTimer = 0;
        const px = Math.round(camera.position.x);
        const py = Math.round(camera.position.y - EYE_HEIGHT);
        const pz = Math.round(camera.position.z);
        coordsRef.current.textContent = `XYZ ${px} / ${py} / ${pz}`;
      }

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

      screenCanvases.forEach((screenCanvas) => {
        screenCanvas.width = 1;
        screenCanvas.height = 1;
      });

      scene.traverse((object) => {
        if (object.isInstancedMesh) object.dispose();
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      disposables.forEach((resource) => resource.dispose());

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
      className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[#8ec9ff] text-white"
    >
      {/* HUD: title */}
      <div className="pointer-events-none absolute left-5 top-20 z-20 max-w-[300px] md:left-10 md:top-24 [@media(max-height:520px)]:hidden">
        <p className="inline-flex items-center gap-2 border border-black/30 bg-black/35 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-lime-200 backdrop-blur-sm">
          <span className="size-1.5 bg-lime-300" />
          A blocky project gallery
        </p>
        <h1 className="mt-2 text-[clamp(1.7rem,3.3vw,2.45rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] [text-shadow:3px_3px_0_rgba(26,38,18,0.9),6px_6px_0_rgba(26,38,18,0.28)]">
          Project <span className="text-lime-300">World</span>
        </h1>
        <p
          ref={coordsRef}
          className="mt-2 hidden font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/75 [text-shadow:0_1px_4px_rgba(0,0,0,0.85)] sm:block"
        >
          XYZ 0 / 0 / 0
        </p>
        {touchMode && (
          <p className="mt-2 max-w-[230px] font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-white/70 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            Stick to move · drag to look · tap a block
          </p>
        )}
      </div>

      {/* HUD: actions */}
      <div className="pointer-events-none absolute right-4 top-20 z-30 flex flex-col items-end gap-2 md:right-8 md:top-24">
        {!touchMode && (
          <button
            type="button"
            onClick={togglePointerLock}
            className="pointer-events-auto inline-flex items-center gap-2 border-2 border-[#1f1f1f] bg-[#6f6f6f] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[inset_2px_2px_0_#adadad,inset_-2px_-2px_0_#373737,3px_3px_0_rgba(0,0,0,0.25)] transition-colors hover:bg-[#7f7f7f] active:shadow-[inset_-2px_-2px_0_#adadad,inset_2px_2px_0_#373737]"
          >
            <MousePointerClick className="size-4" aria-hidden="true" />
            {pointerLocked ? "Release mouse" : "Enter world"}
          </button>
        )}
        <Link
          to="/projects"
          className="pointer-events-auto border-2 border-[#1f1f1f] bg-[#5c5c5c]/90 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider text-white/85 shadow-[inset_2px_2px_0_#8f8f8f,inset_-2px_-2px_0_#303030] backdrop-blur-sm transition-colors hover:bg-[#6d6d6d]"
        >
          Project grid
        </Link>
      </div>

      {/* HUD: crosshair */}
      {pointerLocked && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
            <span className="absolute left-1/2 top-0 h-1.5 w-[2px] -translate-x-1/2 bg-white" />
            <span className="absolute bottom-0 left-1/2 h-1.5 w-[2px] -translate-x-1/2 bg-white" />
            <span className="absolute left-0 top-1/2 h-[2px] w-1.5 -translate-y-1/2 bg-white" />
            <span className="absolute right-0 top-1/2 h-[2px] w-1.5 -translate-y-1/2 bg-white" />
            <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 bg-white" />
          </div>
        </div>
      )}

      {/* HUD: bottom hint (desktop) */}
      {!touchMode && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 bg-gradient-to-t from-black/55 to-transparent px-6 pb-6 pt-16">
          <div className="max-w-full border-2 border-black/60 bg-[#2b2b2b]/90 px-4 py-2 text-center font-mono text-[0.68rem] uppercase tracking-[0.08em] text-white/70 shadow-[inset_2px_2px_0_rgba(255,255,255,0.14),inset_-2px_-2px_0_rgba(0,0,0,0.45)] backdrop-blur-sm">
            {hoveredIndex !== null ? (
              <span className="text-white">
                <span className="font-bold text-lime-300">Click</span> to open ·{" "}
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
      )}

      {/* Mobile controls: analog stick + jump */}
      {touchMode && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-5 pb-[calc(env(safe-area-inset-bottom)_+_2.5rem)]">
          <VirtualJoystick
            onChange={(x, y) => {
              moveInputRef.current.x = x;
              moveInputRef.current.y = y;
            }}
          />

          <button
            type="button"
            aria-label="Jump"
            onPointerDown={(event) => {
              event.preventDefault();
              jumpInputRef.current = true;
            }}
            onContextMenu={(event) => event.preventDefault()}
            className="pointer-events-auto flex size-[4.5rem] touch-none select-none items-center justify-center rounded-full border-2 border-white/30 bg-[#6f6f6f]/90 text-white shadow-[inset_2px_2px_0_#a8a8a8,inset_-2px_-2px_0_#373737,0_6px_22px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform active:scale-95"
          >
            <ArrowUp className="size-7" aria-hidden="true" />
            <span className="sr-only">Jump</span>
          </button>
        </div>
      )}

      {/* Detail panel */}
      {panelOpen && selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <button
            type="button"
            aria-label="Close project details"
            onClick={closeProject}
            className="absolute inset-0 bg-black/60"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            className="relative z-10 max-h-[88dvh] w-full max-w-4xl overflow-y-auto border-4 border-[#55524d] bg-[#1b1b1b] text-white shadow-[inset_2px_2px_0_#3d3a36,inset_-2px_-2px_0_#0a0a0a,0_24px_80px_rgba(0,0,0,0.65)]"
          >
            <div className="flex items-center justify-between border-b-2 border-black/60 bg-[#252525] px-5 py-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]">
              <span
                className="inline-flex items-center gap-2 border-2 border-black/50 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest"
                style={{ color: hexToCss(CATEGORY_HEX[categorize(selectedProject.tech)]) }}
              >
                <span
                  className="size-2"
                  style={{ background: hexToCss(CATEGORY_HEX[categorize(selectedProject.tech)]) }}
                />
                {CATEGORY_LABEL[categorize(selectedProject.tech)]}
              </span>
              <button
                type="button"
                onClick={closeProject}
                className="inline-flex size-9 items-center justify-center border-2 border-[#1f1f1f] bg-[#6f6f6f] text-white/80 shadow-[inset_2px_2px_0_#a0a0a0,inset_-2px_-2px_0_#333] transition-colors hover:bg-[#7f7f7f]"
                aria-label="Close"
              >
                <ArrowUpRight className="size-4 rotate-180" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[1.05fr_1fr] md:gap-8 md:p-7">
              <div className="overflow-hidden border-2 border-black/60 bg-black/30 shadow-[inset_2px_2px_0_rgba(255,255,255,0.08)]">
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
                      className="flex items-center gap-2 border border-white/15 bg-white/5 px-2.5 py-1 text-[0.7rem] text-white/70 shadow-[inset_1px_1px_0_rgba(255,255,255,0.08)]"
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
                    className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-[#2c5a18] bg-[#5b9a35] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[inset_2px_2px_0_#88c45c,inset_-2px_-2px_0_#35661d] transition-colors hover:bg-[#68a93e]"
                  >
                    <Github className="size-4" aria-hidden="true" />
                    GitHub
                  </a>
                  {selectedProject.website && (
                    <a
                      href={selectedProject.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-[#1f1f1f] bg-[#6f6f6f] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[inset_2px_2px_0_#a8a8a8,inset_-2px_-2px_0_#373737] transition-colors hover:bg-[#7f7f7f]"
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
  <kbd className="mx-0.5 inline-flex min-w-[1.35rem] items-center justify-center border border-white/25 bg-white/10 px-1 py-0.5 font-mono text-[0.65rem] leading-none text-white/85 shadow-[inset_1px_1px_0_rgba(255,255,255,0.18),inset_-1px_-1px_0_rgba(0,0,0,0.4)]">
    {children}
  </kbd>
);

export default Showcase;
