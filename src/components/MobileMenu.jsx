import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Linkedin, Moon, Sun } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";

/**
 * Full-screen mobile navigation. Owns its exit timeline so the panel always
 * finishes animating before it unmounts, locks background scroll while open,
 * closes on Escape, and hands focus back to the toggle when dismissed.
 */
const MobileMenu = ({ links, darkMode, onToggleTheme, onSelect, onClose }) => {
  const panelRef = useRef(null);
  const firstLinkRef = useRef(null);
  const exitTlRef = useRef(null);

  const close = () => {
    if (exitTlRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    exitTlRef.current = gsap
      .timeline({ onComplete: onClose })
      .to(
        "[data-menu-line] > span",
        {
          yPercent: -110,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.in",
        },
        0,
      )
      .to(
        panelRef.current,
        { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
        "-=0.3",
      );
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-menu-line] > span", {
            yPercent: 115,
            duration: 0.9,
            stagger: 0.07,
          })
          .from(
            "[data-menu-footer] > *",
            { y: 18, autoAlpha: 0, duration: 0.55, stagger: 0.07 },
            "-=0.5",
          );
      });

      return () => mm.revert();
    },
    { scope: panelRef },
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      exitTlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pt-24 pb-8 md:hidden"
    >
      <nav aria-label="Mobile">
        <ul className="flex flex-col">
          {links.map((link, i) => (
            <li key={link.id} className="border-b border-line">
              <Link
                ref={i === 0 ? firstLinkRef : undefined}
                to={link.path}
                onClick={() => {
                  onSelect(link.id);
                  close();
                }}
                className="flex items-center gap-5 py-5"
              >
                <span className="label">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span data-menu-line className="mask flex-1">
                  <span className="block text-[clamp(2.1rem,9vw,2.9rem)] leading-none font-extrabold tracking-[-0.035em]">
                    {link.name}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div data-menu-footer className="flex flex-col gap-6">
        <Link
          to="/contact"
          onClick={() => {
            onSelect("contact");
            close();
          }}
          className="btn btn-solid w-full"
        >
          Let&rsquo;s talk
        </Link>

        <div className="flex items-center justify-between border-t border-line pt-5">
          <div className="flex items-center gap-5 text-sm font-medium text-muted">
            <a
              href="https://github.com/Dhorq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-ink"
            >
              <Github aria-hidden="true" className="size-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ridhorifqymuhammad/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-ink"
            >
              <Linkedin aria-hidden="true" className="size-4" />
              LinkedIn
            </a>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
            className="flex size-11 cursor-pointer items-center justify-center border border-line transition-colors duration-300 hover:border-ink"
          >
            {darkMode ? (
              <Sun aria-hidden="true" className="size-4" />
            ) : (
              <Moon aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
