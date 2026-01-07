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
    <ul className="flex gap-5 justify-center items-center">
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
          selectedNavbar === "contacts" ? "underline" : ""
        } cursor-pointer hover:opacity-75`}
        onClick={() => setSelectedNavbar("contact")}
      >
        Contact
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
  );
};

export default Navbar;
