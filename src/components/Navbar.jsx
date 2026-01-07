import useGlobalStore from "../stores/useGlobalStore";

import { Lightbulb, LightbulbOff } from "lucide-react";

const Navbar = () => {
  // const { darkMode, toggleDarkMode } = useGlobalStore((state) => ({
  //   darkMode: state.darkMode,
  //   toggleDarkMode: state.toggleDarkMode,
  // }));

  const darkMode = useGlobalStore((state) => state.darkMode);
  const toggleDarkMode = useGlobalStore((state) => state.toggleDarkMode);

  return (
    <ul className="flex gap-5 justify-center items-center">
      <li>About</li>
      <li>Projects</li>
      <li>Experiences</li>
      <li>Educations</li>
      <li>Contacts</li>
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
