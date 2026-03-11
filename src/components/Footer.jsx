import useGlobalStore from "../stores/useGlobalStore";

const Footer = () => {
  const date = new Date().getFullYear();
  const darkMode = useGlobalStore((state) => state.darkMode);

  return (
    <footer
      className={`py-8 border-t transition-colors duration-300 ${
        darkMode ? "border-zinc-800/60" : "border-zinc-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p
          className={`text-sm font-medium ${
            darkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          © {date}{" "}
          <span className={darkMode ? "text-zinc-300" : "text-zinc-600"}>
            Dhorq
          </span>
          <span className="text-cyan-400">.</span>
        </p>
        <p
          className={`text-xs ${
            darkMode ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          Built with lop. &lt;3
        </p>
      </div>
    </footer>
  );
};

export default Footer;
