import { projects } from "../data/projects";
import useGlobalStore from "../stores/useGlobalStore";

const ProjectCard = () => {
  const { darkMode } = useGlobalStore();

  return (
    <div className="grid grid-cols-3 gap-10">
      {projects.map((project) => (
        <div
          key={project.title}
          className={`shadow-md w-60 h-90 justify-start flex flex-col ${
            !darkMode ? "bg-amber-50 text-black" : "bg-gray-800 text-white"
          }`}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_IUNA_8MdwO3FfjsaS_5W5lo1C4qwLa3qVw&s"
            alt="Image"
            className="h-40 w-full object-cover"
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
        </div>
      ))}
    </div>
  );
};

export default ProjectCard;
