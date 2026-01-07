import { projects } from "../data/projects";

const ProjectCard = () => {
  return (
    <div className="grid grid-cols-3 gap-10">
      {projects.map((project) => (
        <div
          key={project.title}
          className="w-75 bg-blue-400 size-50 justify-between flex flex-col"
        >
          <p>{project.title}</p>
          <p>{project.description}</p>
          <p>{project.title}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectCard;
