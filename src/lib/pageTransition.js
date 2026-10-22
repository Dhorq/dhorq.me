import { useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "./anim";

/**
 * Cross-section / route transition.
 *
 * Plays a brief fade between route changes and re-measures ScrollTrigger so
 * reveals stay correct after navigation. Safe for reduced motion (skips fade).
 *
 * @param {boolean} enabled - whether transitions are active (gated by introDone)
 * @param {() => void} onComplete - optional callback after the enter fade
 */
export function usePageTransition(enabled, onComplete) {
  useEffect(() => {
    if (!enabled) return;

    const main = document.querySelector("main");
    if (!main) return;

    const mq = window.matchMedia(NO_MOTION);
    if (mq.matches) {
      ScrollTrigger.refresh();
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      defaults: { duration: 0.55, ease: "power4.inOut" },
      onComplete: () => {
        gsap.set(main, { clearProps: "opacity,y" });
        ScrollTrigger.refresh();
        onComplete?.();
      },
    });

    tl.fromTo(main, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, 0);

    return () => tl.kill();
  }, [enabled, onComplete]);
}

/**
 * Reveal whole section blocks on scroll with optional 3D depth.
 *
 * @param {React.RefObject<HTMLDivElement>} scopeRef
 * @param {{ start?: string; once?: boolean; depth?: boolean }} options
 */
export function useSectionReveal(scopeRef, { start = "top 85%", once = true, depth = false } = {}) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const targets = gsap.utils.toArray("[data-section-reveal]", scope);
        if (!targets.length) return;

        targets.forEach((target) => {
          gsap.from(target, {
            autoAlpha: 0,
            y: depth ? 44 : 30,
            rotationX: depth ? 6 : 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: target, start, once },
          });
        });

        ScrollTrigger.refresh();
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );
}
