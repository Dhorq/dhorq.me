import { Presentation } from "lucide-react";
import { projects } from "../data/projects";
import useGlobalStore from "../stores/useGlobalStore";

const ProjectCard = () => {
  const { darkMode } = useGlobalStore();

  return (
    <div className="grid grid-cols-3 gap-10">
      {projects.map((project) => (
        <div
          key={project.title}
          className={`w-60 h-90 justify-start flex flex-col relative ${
            !darkMode
              ? "bg-amber-50 text-black shadow-md"
              : "bg-stone-900 shadow-[2px_2px_6px_rgba(255,255,255,0.3)] text-white"
          }`}
        >
          <img
            src={project.image}
            alt="Image"
            className="min-h-40 max-h-40 w-full object-cover"
          />
          <div className="grid grid-rows-6 content-between h-full p-2 text-sm">
            <p className="row-span-1 font-medium">{project.title}</p>
            <p className="row-span-4 text-xs">{project.description}</p>
            <ul className="flex gap-1 self-end row-span-1">
              {project.tech.map((t, j) => (
                <li
                  className="size-5 flex items-center justify-center text-center text-xs"
                  key={j}
                >
                  <img src={t} alt="" />
                </li>
              ))}
            </ul>
          </div>
          {project.tutorial ? (
            <div className="absolute right-1 top-1 z-100">
              <Presentation className="size-5 text-red-800" />
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectCard;
