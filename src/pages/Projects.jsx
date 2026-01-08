import { Presentation } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-10">
      <h1 className="text-2xl lg:text-3xl font-black">Projects</h1>
      <p className="text-sm lg:text-sm font-medium text-red-700 flex justify-center items-center text-center italic">
        <Presentation className="size-4" />
        &nbsp;: Coding along in a tutorial.
      </p>
      <ProjectCard />
    </div>
  );
};

export default Projects;
