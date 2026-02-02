import { Presentation } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-10">
      <h1 className="text-2xl lg:text-3xl font-black">Projects</h1>
      {/* <p className="text-sm lg:text-sm font-medium text-green-500 flex justify-center items-center text-center italic">
        <Presentation className="size-4 text-green-500" />
        &nbsp;: Coding along in a tutorial.
      </p> */}
      <ProjectCard />
    </div>
  );
};

export default Projects;
