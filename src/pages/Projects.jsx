import ProjectCard from "../components/ProjectCard";
import useGlobalStore from "../stores/useGlobalStore";

const Projects = () => {
  const darkMode = useGlobalStore((state) => state.darkMode);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 pb-28 md:pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-black mb-3">Projects</h1>
        <div className="w-16 h-1 bg-zinc-400 rounded-full mb-4" />
        <p className={`text-base ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
          A collection of things I've built, from full-stack apps to data pipelines.
        </p>
      </div>

      <ProjectCard />
    </div>
  );
};

export default Projects;
