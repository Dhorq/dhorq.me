import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { NO_MOTION } from "./anim";

/**
 * Subtle 3D tilt for interactive cards (fine pointers only).
 *
 * Rotates the card around its center based on cursor position, clamped so it
 * never feels dizzy. Resets on leave. Honors prefers-reduced-motion.
 *
 * @param {HTMLElement | null} target - DOM node to tilt (the card wrapper)
 * @param {{ maxRotation?: number; scale?: number }} options
 */
export function useTilt3d(target, { maxRotation = 8, scale = 1.02 } = {}) {
  const stateRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = target?.current ?? target;
    if (!el) return;

    const mq = window.matchMedia(NO_MOTION);
    if (!mq.matches || window.matchMedia("(pointer: coarse)").matches) {
      // No tilt on touch / reduced motion: just make sure no stale transform.
      gsap.set(el, { clearProps: "rotationX,rotationY,scale" });
      return;
    }

    const handleMove = (event) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to [-1, 1] then clamp to maxRotation degrees.
      const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * maxRotation;
      const rotateX = -((event.clientY - centerY) / (rect.height / 2)) * maxRotation;

      stateRef.current.x = rotateX;
      stateRef.current.y = rotateY;

      gsap.to(el, {
        rotationX: rotateX,
        rotationY: rotateY,
        scale,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 800,
        transformOrigin: "center center",
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 800,
        transformOrigin: "center center",
      });
    };

    el.addEventListener("mousemove", handleMove, { passive: true });
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "rotationX,rotationY,scale" });
    };
  }, [target, maxRotation, scale]);
}
