import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Footer from "./components/Footer";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import useGlobalStore from "./stores/useGlobalStore";
import { ScrollTrigger } from "./lib/gsap";
import { usePageTransition } from "./lib/pageTransition";

const App = () => {
  const location = useLocation();
  const darkMode = useGlobalStore((state) => state.darkMode);
  const introDone = useGlobalStore((state) => state.introDone);

  // Theme lives on <html> so fixed overlays, selection and scrollbar all follow.
  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", !darkMode);
  }, [darkMode]);

  // Every route has a different height — reset scroll, then re-measure.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  // Cross-route fade transition (skipped for reduced motion).
  usePageTransition(introDone);

  return (
    <>
      {!introDone && <Preloader />}
      <Cursor />
      <ScrollProgress />

      <div className="flex min-h-screen flex-col bg-bg text-ink">
        <Navbar />

        <main className="flex-1">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experiences" element={<About />} />
            <Route path="/educations" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default App;
