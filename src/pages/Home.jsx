import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import portrait from "../assets/img/graduationphoto.jpg";
import { projects } from "../data/projects";
import { email } from "../data/contacts";
import { useReveal } from "../lib/anim";

const keywords = [
  "React",
  "Golang",
  "Node.js",
  "PostgreSQL",
  "TypeScript",
  "Next.js",
  "Docker",
  "Prisma",
  "Express.js",
  "Tailwind CSS",
];

const preview = projects.slice(0, 3);

const Home = () => {
  const pageRef = useRef(null);

  useReveal(pageRef);

  return (
    <div ref={pageRef}>
      <Hero />

      <Marquee items={keywords} />

      {/* Selected work */}
      <section
        aria-labelledby="selected-work"
        className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32"
      >
        <SectionHeading
          index="01"
          label="Selected work"
          lines={["Things I’ve", "built so far."]}
          className="max-w-4xl"
        />

        <div className="mt-14 grid gap-x-8 gap-y-16 md:mt-20 md:grid-cols-2">
          {preview.map((project, i) => (
            <div key={project.title} className={i === 0 ? "md:col-span-2" : ""}>
              <ProjectCard project={project} featured={i === 0} />
            </div>
          ))}
        </div>

        <div className="mt-14 md:mt-20">
          <Link to="/projects" className="btn btn-outline group">
            All {projects.length} projects
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-teaser" className="border-t border-line">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 md:grid-cols-12 md:gap-16 md:px-10 md:py-32">
          <div data-reveal className="md:col-span-5">
            <div className="overflow-hidden border border-line bg-elev">
              <img
                src={portrait}
                alt="Ridho Rifqy Muhammad at his Bina Nusantara University graduation"
                loading="lazy"
                decoding="async"
                width={1200}
                height={1500}
                className="aspect-[4/5] w-full object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
              />
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <SectionHeading
              index="02"
              label="About"
              lines={["A quick", "introduction."]}
              className="max-w-xl"
            />
            <p
              data-reveal
              className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
            >
              I&rsquo;m Ridho Rifqy Muhammad, a recent Computer Science graduate
              from Bina Nusantara University and a full-stack developer building
              end-to-end web applications with React.js, Golang, Express.js,
              PostgreSQL and MongoDB.
            </p>
            <Link data-reveal to="/about" className="btn btn-outline mt-10">
              More about me
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-teaser" className="border-t border-line">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
          <SectionHeading
            index="03"
            label="Contact"
            lines={["Let’s build", "something good."]}
            className="max-w-4xl"
          />

          <p
            data-reveal
            className="mt-8 max-w-xl text-base text-muted md:text-lg"
          >
            Feel free to reach out, I&rsquo;d love to connect and collaborate!
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href={email.href} className="btn btn-solid">
              Write me an email
            </a>
            <a
              href={email.href}
              className="link-underline text-sm font-medium text-muted transition-colors duration-300 hover:text-ink"
            >
              {email.display}
            </a>
            <Link
              to="/contact"
              className="link-underline text-sm font-medium text-muted transition-colors duration-300 hover:text-ink"
            >
              All Social Media Links
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
