import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION, fontsReady } from "../lib/anim";
import useGlobalStore from "../stores/useGlobalStore";

/**
 * One-time introduction. Runs once per page load at the app root, releases the
 * hero/nav entrance timelines via the store, and disappears behind an upward
 * curtain reveal. Skipped entirely for reduced-motion visitors.
 */
const Preloader = () => {
  const rootRef = useRef(null);
  const setIntroDone = useGlobalStore((state) => state.setIntroDone);

  useGSAP(
    () => {
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(safety);
        setIntroDone(true);
      };

      const safety = setTimeout(finish, 5000);

      // A background tab never paints, so rAF-driven timelines would stall and
      // the loader would become a pointless delay. Skip straight to content.
      // Same for reduced motion: there is nothing to animate, so never gate
      // content behind the loader.
      if (
        document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        finish();
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const mark = rootRef.current.querySelector("[data-loader-mark]");
        const line = rootRef.current.querySelector("[data-loader-line]");

        gsap.set(mark, { autoAlpha: 0, y: 26 });
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

        fontsReady().then(() => {
          if (finished) return;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: finish,
          });

          tl.to(mark, { autoAlpha: 1, y: 0, duration: 0.7 })
            .to(line, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, "-=0.35")
            .to({}, { duration: 0.35 })
            .to(mark, { autoAlpha: 0, y: -18, duration: 0.45, ease: "power2.in" })
            .to(line, {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.5,
              ease: "power3.inOut",
            })
            .to(
              rootRef.current,
              { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
              "-=0.2",
            );
        });
      });

      return () => {
        clearTimeout(safety);
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
    >
      <p
        data-loader-mark
        className="text-[clamp(2rem,7vw,3rem)] leading-none font-extrabold tracking-[-0.03em]"
      >
        Dhorq<span className="text-accent">.</span>
      </p>
      <div
        data-loader-line
        className="mt-8 h-px w-[min(260px,58vw)] origin-left bg-line"
      />
    </div>
  );
};

export default Preloader;
