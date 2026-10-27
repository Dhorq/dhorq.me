import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import useGlobalStore from "../stores/useGlobalStore";
import { gsap, useGSAP } from "../lib/gsap";
import { NO_MOTION } from "../lib/anim";

const navLinks = [
  { name: "About", path: "/about", id: "about" },
  { name: "Projects", path: "/projects", id: "projects" },
  { name: "Showcase", path: "/showcase", id: "showcase" },
  { name: "Contact", path: "/contact", id: "contact" },
];

const Navbar = () => {
  const location = useLocation();
  const darkMode = useGlobalStore((state) => state.darkMode);
  const toggleDarkMode = useGlobalStore((state) => state.toggleDarkMode);
  const setSelectedNavbar = useGlobalStore((state) => state.setSelectedNavbar);
  const introDone = useGlobalStore((state) => state.introDone);

  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Never leave the mobile panel open across a navigation (back/forward too).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (!introDone) return;

      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        gsap.from("[data-nav-item]", {
          y: -14,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
        });
      });

      return () => mm.revert();
    },
    { dependencies: [introDone], scope: navRef },
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        ref={navRef}
        aria-label="Primary"
        className={`border-b transition-colors duration-500 ${
          menuOpen || !scrolled
            ? "border-transparent bg-transparent"
            : "border-line bg-bg/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            onClick={() => setSelectedNavbar(null)}
            data-nav-item
            className="text-lg font-extrabold tracking-[-0.03em] transition-opacity duration-300 hover:opacity-60"
          >
            Dhorq<span className="text-accent">.</span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.id} data-nav-item>
                <Link
                  to={link.path}
                  onClick={() => setSelectedNavbar(link.id)}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={`group relative block text-sm font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-[450ms] ${
                      isActive(link.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              data-nav-item
              aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
              className="hidden size-10 cursor-pointer items-center justify-center text-muted transition-colors duration-300 hover:text-ink md:flex"
            >
              {darkMode ? (
                <Sun aria-hidden="true" className="size-4" />
              ) : (
                <Moon aria-hidden="true" className="size-4" />
              )}
            </button>

            <Link
              to="/contact"
              onClick={() => setSelectedNavbar("contact")}
              data-nav-item
              className="btn btn-outline hidden !min-h-10 !px-5 !py-2 text-xs md:inline-flex"
            >
              Let&rsquo;s talk
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              data-nav-item
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-10 cursor-pointer items-center justify-center md:hidden"
            >
              <Menu
                aria-hidden="true"
                className={`absolute size-5 transition-all duration-300 ${
                  menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                aria-hidden="true"
                className={`absolute size-5 transition-all duration-300 ${
                  menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <MobileMenu
          links={navLinks}
          darkMode={darkMode}
          onToggleTheme={toggleDarkMode}
          onSelect={setSelectedNavbar}
          onClose={() => {
            setMenuOpen(false);
            toggleRef.current?.focus();
          }}
        />
      )}
    </header>
  );
};

export default Navbar;
