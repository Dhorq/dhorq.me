import { Link } from "react-router-dom";
import useGlobalStore from "../stores/useGlobalStore";

import { Lightbulb, LightbulbOff } from "lucide-react";

const Navbar = () => {
  // const { darkMode, toggleDarkMode } = useGlobalStore((state) => ({
  //   darkMode: state.darkMode,
  //   toggleDarkMode: state.toggleDarkMode,
  // }));

  const { selectedNavbar, setSelectedNavbar } = useGlobalStore();

  const darkMode = useGlobalStore((state) => state.darkMode);
  const toggleDarkMode = useGlobalStore((state) => state.toggleDarkMode);

  return (
    <div className="flex justify-center items-center">
      <ul className="hidden md:flex gap-5 justify-center items-center">
        <Link
          to="/about"
          className={`${
            selectedNavbar === "about" ? "underline" : ""
          } cursor-pointer hover:opacity-75`}
          onClick={() => setSelectedNavbar("about")}
        >
          About
        </Link>
        <Link
          to="/projects"
          className={`${
            selectedNavbar === "projects" ? "underline" : ""
          } cursor-pointer hover:opacity-75`}
          onClick={() => setSelectedNavbar("projects")}
        >
          Projects
        </Link>
        {/* <li
        className={`${
          selectedNavbar === "experiences" ? "underline" : ""
        } cursor-pointer hover:opacity-75`}
        onClick={() => setSelectedNavbar("experiences")}
      >
        Experiences
      </li>
      <li
        className={`${
          selectedNavbar === "educations" ? "underline" : ""
        } cursor-pointer hover:opacity-75`}
        onClick={() => setSelectedNavbar("educations")}
      >
        Educations
      </li> */}
        <Link
          to="/contact"
          className={`${
            selectedNavbar === "contact" ? "underline" : ""
          } cursor-pointer hover:opacity-75`}
          onClick={() => setSelectedNavbar("contact")}
        >
          Contacts
        </Link>
        {!darkMode ? (
          <LightbulbOff
            onClick={toggleDarkMode}
            className="size-4 cursor-pointer hover:opacity-75"
          />
        ) : (
          <Lightbulb
            onClick={toggleDarkMode}
            className="size-4 cursor-pointer hover:opacity-75"
          />
        )}
      </ul>
      <div
        className={`fixed flex items-center justify-center md:hidden bottom-5 bg-black/50 mx-2 h-12 w-90 rounded-full z-100 px-3 ${
          darkMode ? "bg-white/50 text-black" : "bg-black text-white"
        }`}
      >
        <div className="flex justify-between items-center text-center gap-10">
          <Link
            to="/about"
            className={`${selectedNavbar === "about" ? "bg-gray-300 rounded-full px-3 py-1" : ""}`}
            onClick={() => setSelectedNavbar("about")}
          >
            About
          </Link>
          <Link
            to="/projects"
            className={`${selectedNavbar === "projects" ? "bg-gray-300 rounded-full px-3 py-1" : ""}`}
            onClick={() => setSelectedNavbar("projects")}
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className={`${selectedNavbar === "contact" ? "bg-gray-300 rounded-full px-3 py-1" : ""}`}
            onClick={() => setSelectedNavbar("contact")}
          >
            Contacts
          </Link>
          {!darkMode ? (
            <LightbulbOff
              onClick={toggleDarkMode}
              className="size-4 cursor-pointer hover:opacity-75"
            />
          ) : (
            <Lightbulb
              onClick={toggleDarkMode}
              className="size-4 cursor-pointer hover:opacity-75"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
