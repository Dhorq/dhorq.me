import { useRef } from "react";
import portrait from "../assets/img/graduationphoto.jpg";
import SectionHeading from "../components/SectionHeading";
import { useReveal, useSplitReveal } from "../lib/anim";

const timeline = [
  {
    period: "5th Semester – Graduation",
    title: "Data Analytics Focus",
    current: false,
    body: "Focused on Data Analytics with internships as a System Analyst at the Ministry of Finance (KEMENKEU) and as a Data Analyst at the House of Representatives (DPR RI).",
  },
  {
    period: "Post-graduation",
    title: "Data Engineering",
    current: false,
    body: "Developed a strong interest in Data Engineering and pursued it through self-directed learning, further strengthening coding abilities and technical skills through June.",
  },
  {
    period: "July 2025 – Present",
    title: "Full Stack Development",
    current: true,
    body: "Deliberately pursued a self-taught path as a Full Stack Developer, gaining hands-on experience with JavaScript, Golang, React, Node.js, Express, PostgreSQL, Prisma, MongoDB, TypeScript, and RESTful APIs. Currently expanding expertise in Golang.",
  },
];

const skillGroups = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Golang"] },
  { title: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS"] },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "Gin", "Fiber", "REST APIs"],
  },
  { title: "Data", items: ["PostgreSQL", "MongoDB", "Prisma"] },
  { title: "Auth & quality", items: ["JWT", "Bcrypt", "Zod / Joi", "Winston"] },
  { title: "Tooling", items: ["Docker", "Git"] },
];

const About = () => {
  const pageRef = useRef(null);

  useReveal(pageRef);
  useSplitReveal(pageRef, { stagger: 0.07 });

  return (
    <div
      ref={pageRef}
      className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32"
    >
      <SectionHeading
        index="01"
        label="About"
        lines={["Building", "end to end."]}
        className="max-w-4xl"
      />

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
        <div data-reveal className="md:col-span-4">
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

        <div className="md:col-span-7 md:col-start-6">
          <p
            data-split
            className="text-[clamp(1.3rem,2.5vw,1.85rem)] leading-[1.35] font-medium tracking-[-0.02em] text-balance"
          >
            My name is Ridho Rifqy Muhammad, a recent Computer Science graduate
            from Bina Nusantara University and full-stack developer with
            experience building end-to-end web applications using React.js,
            Golang, Express.js, PostgreSQL, and MongoDB.
          </p>

          <p
            data-reveal
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted"
          >
            I have a solid foundation in software engineering and application
            development, with experience in building{" "}
            <span className="text-ink">
              REST APIs, implementing JWT and cookie-based
              authentication/authorization, bcrypt password hashing, and
              deploying applications including validation and logging.
            </span>{" "}
            Driven by curiosity and a growth mindset, I am eager to pursue
            full-stack roles and continuously learn new technologies to deliver
            meaningful solutions for users.
          </p>
        </div>
      </div>

      {/* Academic experience */}
      <section aria-labelledby="academic-experience" className="mt-24 border-t border-line pt-12 md:mt-32 md:pt-16">
        <h2 id="academic-experience" className="label">
          Academic experience
        </h2>

        <ol className="mt-10 border-l border-line pl-8 md:pl-10">
          {timeline.map((item) => (
            <li
              key={item.title}
              data-reveal
              className="relative pb-10 last:pb-0 md:pb-12"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1.5 -left-[calc(2rem+4.5px)] size-2.5 rounded-full md:-left-[calc(2.5rem+4.5px)] ${
                  item.current ? "bg-accent" : "bg-muted"
                }`}
              />
              <p className="label">{item.period}</p>
              <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] md:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Technical skills */}
      <section aria-labelledby="technical-skills" className="mt-24 border-t border-line pt-12 md:mt-32 md:pt-16">
        <h2 id="technical-skills" className="label">
          Technical skills
        </h2>

        <div className="mt-10">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              data-reveal
              className="grid grid-cols-1 gap-4 border-t border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-8 last:border-b"
            >
              <p className="label pt-1.5">{group.title}</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group/skill cursor-default text-base font-medium transition-transform duration-300 hover:translate-x-1 md:text-lg"
                  >
                    {item}
                    <span
                      aria-hidden="true"
                      className="ml-2 inline-block size-1 translate-y-[-1px] rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
