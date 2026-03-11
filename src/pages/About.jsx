import useGlobalStore from "../stores/useGlobalStore";
import { GraduationCap, Code2 } from "lucide-react";

const skills = [
  "JavaScript",
  "TypeScript",
  "Golang",
  "Gin",
  "Fiber",
  "Docker",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "REST APIs",
  "JWT",
  "Bcrypt",
  "Git",
  "Tailwind CSS",
  "Zod / Joi",
  "Winston",
];

const timeline = [
  {
    period: "5th Semester – Graduation",
    title: "Data Analytics Focus",
    color: "bg-zinc-400",
    ring: "ring-zinc-400/20",
    body: "Focused on Data Analytics with internships as a System Analyst at the Ministry of Finance (KEMENKEU) and as a Data Analyst at the House of Representatives (DPR RI).",
  },
  {
    period: "Post-graduation",
    title: "Data Engineering",
    color: "bg-zinc-500",
    ring: "ring-zinc-500/20",
    body: "Developed a strong interest in Data Engineering and pursued it through self-directed learning, further strengthening coding abilities and technical skills through June.",
  },
  {
    period: "July 2025 – Present",
    title: "Full Stack Development",
    color: "bg-green-400",
    ring: "ring-green-400/30",
    animate: true,
    body: "Deliberately pursued a self-taught path as a Full Stack Developer, gaining hands-on experience with JavaScript, Golang, React, Node.js, Express, PostgreSQL, Prisma, MongoDB, TypeScript, and RESTful APIs. Currently expanding expertise in Golang.",
  },
];

const About = () => {
  const darkMode = useGlobalStore((state) => state.darkMode);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 pb-28 md:pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-black mb-3">About Me</h1>
        <div
          className={`w-16 h-1 rounded-full ${
            darkMode ? "bg-zinc-400" : "bg-zinc-500"
          }`}
        />
      </div>

      {/* Bio */}
      <div
        className={`space-y-5 text-base leading-8 mb-16 ${
          darkMode ? "text-zinc-300" : "text-zinc-600"
        }`}
      >
        <p>
          My name is{" "}
          <strong
            className={`font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}
          >
            Ridho Rifqy Muhammad
          </strong>
          , a recent Computer Science graduate from Bina Nusantara University
          and full-stack developer with experience building end-to-end web{" "}
          <span className="text-cyan-400 font-medium">
            applications using React.js, Golang, Express.js, PostgreSQL, and
            MongoDB.
          </span>
        </p>
        <p>
          I have a solid foundation in software engineering and application
          development, with experience in building{" "}
          <span className="text-cyan-400 font-medium">
            REST APIs, implementing JWT and cookie-based
            authentication/authorization, bcrypt password hashing, and deploying
            applications including validation and logging.
          </span>{" "}
          Driven by curiosity and a growth mindset, I am eager to pursue
          full-stack roles and continuously learn new technologies to deliver
          meaningful solutions for users.
        </p>
      </div>

      {/* Academic Experience */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-white/10" : "bg-zinc-100"
            }`}
          >
            <GraduationCap
              className={`size-5 ${
                darkMode ? "text-zinc-300" : "text-zinc-600"
              }`}
            />
          </div>
          <h2 className="text-xl font-bold">Academic Experience</h2>
        </div>

        <div
          className={`space-y-8 border-l-2 pl-6 ml-1 ${
            darkMode ? "border-zinc-800" : "border-zinc-200"
          }`}
        >
          {timeline.map((item, i) => (
            <div key={i} className="relative">
              <div
                className={`absolute -left-[25px] -translate-x-1/2 top-1.5 size-3 rounded-full ring-4 ${item.color} ${item.ring} ${item.animate ? "animate-pulse" : ""}`}
              />
              <p
                className={`text-xs font-medium mb-1 ${
                  darkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {item.period}
              </p>
              <h3
                className={`font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-zinc-800"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm leading-7 ${
                  darkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-white/10" : "bg-zinc-100"
            }`}
          >
            <Code2
              className={`size-5 ${
                darkMode ? "text-zinc-300" : "text-zinc-600"
              }`}
            />
          </div>
          <h2 className="text-xl font-bold">Technical Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 cursor-default hover:-translate-y-0.5 ${
                darkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-white/50 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-600 shadow-sm hover:border-zinc-500 hover:text-zinc-900"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
