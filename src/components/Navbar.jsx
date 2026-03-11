import { Link, useLocation } from "react-router-dom";
import useGlobalStore from "../stores/useGlobalStore";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { name: "About", path: "/about", id: "about" },
  { name: "Projects", path: "/projects", id: "projects" },
  { name: "Contact", path: "/contact", id: "contact" },
];

const Navbar = () => {
  const { setSelectedNavbar, darkMode, toggleDarkMode } = useGlobalStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Fixed Top Navbar — Desktop */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode
            ? "bg-[#09090b]/80 border-zinc-800/60"
            : "bg-white/80 border-zinc-200/60"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setSelectedNavbar(null)}
            className={`text-xl font-black tracking-tight transition-colors duration-200 ${
              darkMode
                ? "text-white hover:text-zinc-300"
                : "text-zinc-900 hover:text-zinc-600"
            }`}
          >
            Dhorq<span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>.</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => setSelectedNavbar(link.id)}
                className={`relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
                  isActive(link.path)
                    ? darkMode
                      ? "text-white"
                      : "text-zinc-900"
                    : darkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full ${
                      darkMode ? "bg-zinc-400" : "bg-zinc-500"
                    }`}
                  />
                )}
              </Link>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className={`cursor-pointer p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                darkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
          </ul>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden backdrop-blur-xl rounded-full border shadow-2xl transition-all duration-300 ${
          darkMode
            ? "bg-zinc-900/90 border-zinc-700/50 shadow-black/50"
            : "bg-white/95 border-zinc-200/80 shadow-zinc-300/40"
        }`}
      >
        <div className="flex items-center gap-1 px-3 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              onClick={() => setSelectedNavbar(link.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? darkMode
                    ? "bg-white text-black font-semibold"
                    : "bg-zinc-900 text-white font-semibold"
                  : darkMode
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className={`ml-1 p-2 rounded-full transition-all duration-200 ${
              darkMode
                ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
