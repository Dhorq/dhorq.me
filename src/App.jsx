import Navbar from "./components/Navbar";
import useGlobalStore from "./stores/useGlobalStore";

const App = () => {
  const darkMode = useGlobalStore((state) => state.darkMode);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } p-10 min-h-screen`}
    >
      <Navbar />
    </div>
  );
};

export default App;
