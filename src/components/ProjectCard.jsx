import { projects } from "../data/projects";
import useGlobalStore from "../stores/useGlobalStore";
import { ExternalLink } from "lucide-react";

const ProjectCard = () => {
  const { darkMode } = useGlobalStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {projects.map((project) => (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          key={project.title}
          className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
            darkMode
              ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:shadow-white/5"
              : "bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-zinc-200/80 shadow-sm"
          }`}
        >
          {/* Image */}
          <div className="relative overflow-hidden h-44 shrink-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                <ExternalLink className="size-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`flex flex-col flex-1 p-4 gap-3 ${
              darkMode ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            <h3
              className={`font-semibold text-sm leading-snug ${
                darkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`text-xs leading-5 flex-1 ${
                darkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {project.description}
            </p>

            {/* Tech icons */}
            <div
              className={`flex gap-1.5 flex-wrap pt-3 mt-auto border-t ${
                darkMode ? "border-zinc-800" : "border-zinc-100"
              }`}
            >
              {project.tech.map((t, j) => (
                <img
                  key={j}
                  src={t}
                  alt=""
                  className="size-5 object-contain"
                />
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ProjectCard;
