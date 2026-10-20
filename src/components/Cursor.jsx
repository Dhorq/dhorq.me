import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

/**
 * Restrained cursor follower for fine pointers only. The native cursor stays
 * visible — this is a trailing indicator, not a cursor replacement — and the
 * element is inert so it never intercepts clicks or text selection.
 */
const Cursor = () => {
  const dotRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const dot = dotRef.current;

      gsap.set(dot, {
        xPercent: -50,
        yPercent: -50,
        x: -200,
        y: -200,
        autoAlpha: 1,
      });

      const moveX = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
      const moveY = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });

      const onMove = (event) => {
        moveX(event.clientX);
        moveY(event.clientY);
      };

      const onOver = (event) => {
        const interactive = event.target.closest?.(
          "a, button, [role='button'], input, textarea, select",
        );
        gsap.to(dot, {
          scale: interactive ? 2.6 : 1,
          backgroundColor: interactive
            ? "rgba(34, 211, 238, 0.14)"
            : "rgba(34, 211, 238, 0)",
          borderColor: interactive ? "rgba(34, 211, 238, 0.8)" : "rgba(34, 211, 238, 0.55)",
          duration: 0.4,
          ease: "power3.out",
        });
      };

      const onLeave = () => {
        gsap.to(dot, { autoAlpha: 0, duration: 0.3 });
      };

      const onEnter = () => {
        gsap.to(dot, { autoAlpha: 1, duration: 0.3 });
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseover", onOver, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      document.addEventListener("mouseenter", onEnter);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseover", onOver);
        window.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("mouseenter", onEnter);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] size-3 rounded-full border border-accent opacity-0"
    />
  );
};

export default Cursor;
