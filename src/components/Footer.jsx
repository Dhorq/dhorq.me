import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";

const Footer = () => {
  const date = new Date().getFullYear();
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        gsap.from("[data-footer-item]", {
          y: 16,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 96%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer ref={rootRef} className="border-t border-line py-10 md:py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <p data-footer-item className="text-sm text-muted">
          &copy; {date} <span className="text-ink">Dhorq<span className="text-accent">.</span></span>
        </p>

        <div data-footer-item className="flex items-center gap-6">
          <p className="text-xs text-muted">Built with love. &lt;3</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="link-underline inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted transition-colors duration-300 hover:text-ink"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
