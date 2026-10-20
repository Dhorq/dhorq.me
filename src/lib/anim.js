import { gsap, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/** Query string for every "motion is welcome" matchMedia context. */
export const NO_MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Resolves once webfonts are usable, with a hard cap so animation never waits
 * on a slow network. Splitting text before fonts settle produces wrong lines.
 */
export const fontsReady = () =>
  Promise.race([
    typeof document !== "undefined" && document.fonts
      ? document.fonts.ready
      : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);

/**
 * Scroll-triggered reveal for every `[data-reveal]` element inside `scopeRef`.
 *
 * The animation is bound to its ScrollTrigger instead of being fired from an
 * `onEnter` callback: a callback can be skipped when a fast scroll or a restored
 * scroll position crosses the start in a single step, which would strand the
 * element in its hidden state. A bound tween always plays out.
 *
 * Elements are only hidden when motion is allowed, so the page stays fully
 * readable if animation cannot run.
 */
export function useReveal(scopeRef, { start = "top 88%" } = {}) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        const targets = gsap.utils.toArray("[data-reveal]", scope);
        if (!targets.length) return;

        targets.forEach((target) => {
          gsap.from(target, {
            autoAlpha: 0,
            y: 44,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: target, start, once: true },
          });
        });

        ScrollTrigger.refresh();
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );
}

/**
 * Line-by-line masked reveal for `[data-split]` elements using SplitText.
 * Splitting is deferred until fonts are ready and re-runs on resize via
 * `autoSplit`, so lines stay correct at every viewport size.
 */
export function useSplitReveal(
  scopeRef,
  { start = "top 85%", stagger = 0.09, yPercent = 115 } = {},
) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      const splits = [];
      let elements = [];
      let cancelled = false;

      // Hide synchronously (pre-paint) so the text never flashes unstyled.
      mm.add(NO_MOTION, () => {
        elements = gsap.utils.toArray("[data-split]", scope);
        gsap.set(elements, { autoAlpha: 0 });
      });

      fontsReady().then(() => {
        if (cancelled || !elements.length) return;

        mm.add(NO_MOTION, () => {
          elements.forEach((textEl) => {
            const split = SplitText.create(textEl, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              // Returning the tween lets autoSplit rebuild it after a re-split
              // (resize / late webfont) instead of leaving stale line boxes.
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent,
                  duration: 1,
                  stagger,
                  ease: "power4.out",
                  scrollTrigger: { trigger: textEl, start, once: true },
                }),
            });
            splits.push(split);

            // Element is back on screen; its lines are masked away by the tween.
            gsap.set(textEl, { autoAlpha: 1 });
          });

          ScrollTrigger.refresh();
        });
      });

      return () => {
        cancelled = true;
        mm.revert();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: scopeRef },
  );
}
