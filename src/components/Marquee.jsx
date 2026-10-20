import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";

/**
 * Seamless keyword band. The track holds two identical groups so the -50%
 * loop never shows a seam; the duplicate group is hidden from screen readers
 * so the phrases are announced once.
 */
const Marquee = ({ items, duration = 38 }) => {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;

      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        tweenRef.current = gsap.to(trackRef.current, {
          xPercent: -50,
          duration,
          ease: "none",
          repeat: -1,
        });
      });

      // Pause while hovered so the keywords can actually be read.
      const pause = () => tweenRef.current?.pause();
      const resume = () => tweenRef.current?.resume();

      wrapper.addEventListener("mouseenter", pause);
      wrapper.addEventListener("mouseleave", resume);

      return () => {
        mm.revert();
        tweenRef.current = null;
        wrapper.removeEventListener("mouseenter", pause);
        wrapper.removeEventListener("mouseleave", resume);
      };
    },
    { dependencies: [items, duration], scope: wrapperRef },
  );

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden border-y border-line py-6 select-none md:py-8"
    >
      <div ref={trackRef} className="flex w-max">
        {[0, 1].map((group) => (
          <ul
            key={group}
            className="flex shrink-0 items-center"
            aria-hidden={group === 1 ? "true" : undefined}
          >
            {items.map((item) => (
              <li key={item} className="flex items-center">
                <span className="px-6 text-[clamp(1.15rem,2.4vw,1.9rem)] font-semibold tracking-[-0.02em] whitespace-nowrap md:px-8">
                  {item}
                </span>
                <span aria-hidden="true" className="size-1.5 rotate-45 bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
