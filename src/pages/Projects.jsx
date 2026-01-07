import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-10">
      <h1 className="text-3xl font-black">Projects</h1>
      <ProjectCard />
    </div>
  );
};

export default Projects;
