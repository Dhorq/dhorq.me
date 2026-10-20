import { useRef } from "react";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import { useReveal } from "../lib/anim";

const Projects = () => {
  const pageRef = useRef(null);

  useReveal(pageRef);

  const [featured, ...rest] = projects;

  return (
    <div
      ref={pageRef}
      className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32"
    >
      <SectionHeading
        index="01"
        label={`${projects.length} projects`}
        lines={["Selected", "work."]}
        className="max-w-4xl"
      />

      <p
        data-reveal
        className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
      >
        A collection of things I&rsquo;ve built, from full-stack apps to data
        projects.
      </p>
      <p data-reveal className="label mt-4">
        Only featured projects are displayed here — smaller projects are not
        shown.
      </p>

      <div className="mt-14 md:mt-20">
        <ProjectCard project={featured} featured />
      </div>

      <div className="mt-20 grid gap-x-8 gap-y-16 md:mt-28 md:grid-cols-2">
        {rest.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
