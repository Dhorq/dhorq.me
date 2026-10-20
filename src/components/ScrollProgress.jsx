import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";

/** Thin accent line tracking overall reading progress. */
const ScrollProgress = () => {
  const barRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(NO_MOTION, () => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left scale-x-0 bg-accent"
    />
  );
};

export default ScrollProgress;
