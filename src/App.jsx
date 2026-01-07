import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import useGlobalStore from "./stores/useGlobalStore";
import Projects from "./pages/Projects";

const App = () => {
  const darkMode = useGlobalStore((state) => state.darkMode);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } p-10 min-h-screen gap-15 flex flex-col`}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experiences" element={<About />} />
        <Route path="/educations" element={<About />} />
        <Route path="/contacts" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
