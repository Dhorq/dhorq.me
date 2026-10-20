import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";

/**
 * Editorial section header: an indexed label with a rule, then a heading whose
 * authored lines rise out of their masks on first scroll into view.
 */
const SectionHeading = ({ index, label, lines, className = "", children }) => {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const scope = rootRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        const innerLines = gsap.utils.toArray("[data-heading-line] > span", scope);
        const meta = scope.querySelector("[data-heading-label]");

        const trigger = { trigger: scope, start: "top 88%", once: true };

        if (meta) {
          gsap.from(meta, {
            y: 16,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: trigger,
          });
        }

        gsap.from(innerLines, {
          yPercent: 115,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: trigger,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      <div
        data-heading-label
        className="mb-6 flex items-center gap-4 md:mb-8"
      >
        <span className="label">
          {index ? `${index} / ` : ""}
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>

      <h2 className="text-[clamp(2.1rem,6.2vw,4.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance">
        {lines.map((line, i) => (
          <span key={i} data-heading-line className="mask">
            <span className="block">{line}</span>
          </span>
        ))}
        {children}
      </h2>
    </div>
  );
};

export default SectionHeading;
