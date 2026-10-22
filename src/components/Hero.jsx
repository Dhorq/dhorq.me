import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";
import useGlobalStore from "../stores/useGlobalStore";
import ThreeBackground from "../components/ThreeBackground";

const stats = [
  { value: "20+", label: "Projects Built" },
  { value: "10+", label: "Technologies" },
  { value: "1+", label: "Years Learning" },
];

/**
 * First screen. The entrance timeline is released by the preloader (or runs
 * immediately on later visits / reduced motion) and plays behind the curtain so
 * navigation and headline never appear mid-animation.
 */
const Hero = () => {
  const rootRef = useRef(null);
  const introDone = useGlobalStore((state) => state.introDone);
  const setSelectedNavbar = useGlobalStore((state) => state.setSelectedNavbar);

  useGSAP(
    () => {
      if (!introDone) return;

      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from("[data-hero-name]", { y: 18, autoAlpha: 0, duration: 0.7 }, 0.06)
          .from(
            "[data-hero-line] > span",
            { yPercent: 112, duration: 1.15, stagger: 0.13 },
            0.16,
          )
          .from("[data-hero-copy]", { y: 26, autoAlpha: 0, duration: 0.85 }, 0.6)
          .from(
            "[data-hero-cta]",
            { y: 22, autoAlpha: 0, duration: 0.75, stagger: 0.09 },
            0.75,
          )
          .from(
            "[data-hero-meta] > *",
            { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.07 },
            0.95,
          )
          .from("[data-hero-stats] > *", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 1.05)
          .from("[data-hero-cue]", { autoAlpha: 0, duration: 0.6 }, 1.2);

        // Restrained parallax as the hero leaves the viewport.
        gsap.to("[data-hero-parallax]", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Magnetic pull on the primary action, fine pointers only.
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const target = rootRef.current.querySelector("[data-magnetic]");
        if (!target) return;

        const xTo = gsap.quickTo(target, "x", { duration: 0.45, ease: "power3" });
        const yTo = gsap.quickTo(target, "y", { duration: 0.45, ease: "power3" });

        const onMove = (event) => {
          const rect = target.getBoundingClientRect();
          xTo((event.clientX - (rect.left + rect.width / 2)) * 0.22);
          yTo((event.clientY - (rect.top + rect.height / 2)) * 0.32);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        target.addEventListener("mousemove", onMove);
        target.addEventListener("mouseleave", onLeave);

        return () => {
          target.removeEventListener("mousemove", onMove);
          target.removeEventListener("mouseleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { dependencies: [introDone], scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />

      <div
        data-hero-parallax
        className="relative mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-center px-6 pt-28 pb-10 md:px-10 md:pt-32 md:pb-12"
      >
        <ThreeBackground className="z-[-1]" />
        <div className="max-w-5xl">
          {/* <p
            data-hero-label
            className="inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5"
          >
            <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-accent" />
            <span className="label">Available for work</span>
          </p> */}

          <p data-hero-name className="mt-8 text-lg font-medium text-muted md:text-xl">
            Hi, I&rsquo;m Ridho
          </p>

          <h1
            id="hero-title"
            className="mt-3 text-[clamp(3.1rem,12.4vw,9rem)] leading-[0.88] font-extrabold tracking-[-0.045em]"
          >
            <span data-hero-line className="mask">
              <span className="block">Full Stack</span>
            </span>
            <span data-hero-line className="mask">
              <span className="block">
                Developer<span className="text-accent">.</span>
              </span>
            </span>
          </h1>

          <p
            data-hero-copy
            className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            Computer Science graduate building modern web applications with{" "}
            <span className="text-ink">React</span>, <span className="text-ink">Golang</span>, and
            more. Passionate about clean code and great user experiences.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-6">
            <Link
              to="/projects"
              onClick={() => setSelectedNavbar("projects")}
              data-hero-cta
              className="btn btn-solid group"
            >
              <span data-magnetic className="inline-flex items-center gap-2">
                View projects
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setSelectedNavbar("contact")}
              data-hero-cta
              className="btn btn-outline"
            >
              Get in touch
            </Link>

            <a
              href="https://github.com/Dhorq"
              target="_blank"
              rel="noopener noreferrer"
              data-hero-cta
              className="link-underline text-sm font-medium text-muted transition-colors duration-300 hover:text-ink"
            >
              GitHub
            </a>

            <a
              href="https://dhorq.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              data-hero-cta
              className="link-underline text-sm font-medium text-muted transition-colors duration-300 hover:text-ink"
            >
              Portfolio v1
            </a>
          </div>
        </div>

        <div
          data-hero-meta
          className="mt-16 flex flex-col gap-8 border-t border-line pt-8 md:mt-24 md:flex-row md:items-end md:justify-between"
        >
          <dl data-hero-stats className="grid grid-cols-3 gap-6 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col preserve-3d backface-hidden">
                <dt className="label order-2 mt-1.5">{stat.label}</dt>
                <dd className="order-1 text-[clamp(1.6rem,3.4vw,2.25rem)] font-bold tracking-[-0.03em] tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div data-hero-cue className="hidden items-center gap-4 sm:flex">
            <span className="label">Scroll</span>
            <span aria-hidden="true" className="scroll-cue relative h-10 w-px overflow-hidden bg-line" />
          </div>

          <a
            href="https://www.linkedin.com/in/ridhorifqymuhammad/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-ink sm:hidden"
          >
            LinkedIn
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
