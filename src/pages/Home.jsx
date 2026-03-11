import { Link } from "react-router-dom";
import useGlobalStore from "../stores/useGlobalStore";
import { ArrowRight, Github, Mail, ExternalLink } from "lucide-react";

const Home = () => {
  const darkMode = useGlobalStore((state) => state.darkMode);
  const setSelectedNavbar = useGlobalStore((state) => state.setSelectedNavbar);

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-6 pb-20 md:pb-0">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 ${
            darkMode ? "bg-white" : "bg-zinc-400"
          }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-8 ${
            darkMode ? "bg-zinc-400" : "bg-zinc-300"
          }`}
        />
      </div>

      <div className="mt-7 text-center z-10 max-w-4xl mx-auto">
        {/* Status badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-400/30 text-green-400 bg-cyan-400/5 text-sm font-medium mb-8">
          <span className="size-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          Available for work
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-in-up-delay-1 text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-5 tracking-tight">
          Hi, I'm{" "}
          {/* <span className={darkMode ? "text-cyan-400	" : "text-cyan-500"}> */}
            Ridho
          {/* </span> */}
        </h1>

        {/* Role */}
        <p
          className={`animate-fade-in-up-delay-2 text-lg md:text-xl font-semibold mb-4 ${
            darkMode ? "text-zinc-300" : "text-zinc-700"
          }`}
        >
          Full Stack Developer
        </p>

        {/* Description */}
        <p
          className={`animate-fade-in-up-delay-3 text-base md:text-md leading-relaxed max-w-2xl mx-auto mb-12 ${
            darkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Computer Science graduate building modern web applications with <span className="text-cyan-400">React,
          Golang</span>, and more. Passionate about clean code and great user
          experiences.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up-delay-4 flex flex-wrap gap-3 justify-center mb-20">
          <Link
            to="/projects"
            onClick={() => setSelectedNavbar("projects")}
            className={`flex items-center gap-2 px-6 py-3 font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm ${
              darkMode
                ? "bg-white text-black hover:bg-zinc-200 hover:shadow-white/10"
                : "bg-zinc-900 text-white hover:bg-zinc-700 hover:shadow-zinc-900/20"
            }`}
          >
            View Projects
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://github.com/Dhorq"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 px-6 py-3 border font-bold rounded-full transition-all duration-300 hover:scale-105 text-sm ${
              darkMode
                ? "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/50"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Github className="size-4" />
            GitHub
          </a>
          <Link
            to="/contact"
            onClick={() => setSelectedNavbar("contact")}
            className={`flex items-center gap-2 px-6 py-3 border font-bold rounded-full transition-all duration-300 hover:scale-105 text-sm ${
              darkMode
                ? "border-zinc-700 text-zinc-300 hover:border-zinc-400 hover:text-white hover:bg-white/5"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Mail className="size-4" />
            Contact Me
          </Link>
          <a
            href="https://dhorq.vercel.app"
            target="_blank"
            rel="noreferrer"
            className={`relative flex items-center gap-2 px-6 py-3 font-bold rounded-full transition-all duration-300 hover:scale-105 text-sm border-2 border-dashed ${
              darkMode
                ? "border-zinc-600 text-zinc-400 hover:border-zinc-300 hover:text-white"
                : "border-zinc-400 text-zinc-500 hover:border-zinc-700 hover:text-zinc-900"
            }`}
          >
            <ExternalLink className="size-4" />
            Another Portfolio
            <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${
              darkMode ? "bg-zinc-700 text-zinc-300" : "bg-zinc-200 text-zinc-600"
            }`}>v1</span>
          </a>
        </div>

        {/* Stats row */}
        <div
          className={`pt-8 border-t flex justify-center gap-8 md:gap-16 ${
            darkMode ? "border-zinc-800/80" : "border-zinc-200"
          }`}
        >
          {[
            { value: "20+", label: "Projects Built" },
            { value: "10+", label: "Technologies" },
            { value: "1+", label: "Years Learning" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className={`text-2xl md:text-3xl font-black ${
                  darkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                {stat.value}
              </p>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
