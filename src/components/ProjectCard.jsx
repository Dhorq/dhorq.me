import { projects } from "../data/projects";
import useGlobalStore from "../stores/useGlobalStore";
import {  Github, Globe } from "lucide-react";

const normalizeUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const ProjectCard = () => {
  const { darkMode } = useGlobalStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {projects.map((project) => {
        const githubUrl = normalizeUrl(project.link);
        const websiteUrl = normalizeUrl(project.website);
        const hasWebsite = Boolean(websiteUrl);

        return (
          <div
            key={project.title}
            className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              darkMode
                ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:shadow-white/5"
                : "bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-zinc-200/80 shadow-sm"
            }`}
          >
            {/* Image */}
            <div className="relative overflow-hidden h-44 shrink-0">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
              </div>
            </div>

            {/* Content */}
            <div
              className={`flex flex-col flex-1 p-4 gap-3 ${
                darkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              <h3
                className={`font-semibold text-sm leading-snug ${
                  darkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                {project.title}
              </h3>
              <p
                className={`text-xs leading-5 flex-1 ${
                  darkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {project.description}
              </p>

              {/* Tech icons */}
              <div
                className={`flex gap-1.5 flex-wrap pt-3 mt-auto border-t ${
                  darkMode ? "border-zinc-800" : "border-zinc-100"
                }`}
              >
                {project.tech.map((t, j) => (
                  <img
                    key={j}
                    src={t}
                    alt=""
                    className="size-5 object-contain"
                  />
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    darkMode
                      ? "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <Github className="size-3.5" />
                  GitHub
                </a>

                {hasWebsite ? (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      darkMode
                        ? "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <Globe className="size-3.5" />
                    Website
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium cursor-not-allowed ${
                      darkMode
                        ? "border-zinc-800 bg-zinc-900 text-zinc-600"
                        : "border-zinc-200 bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    <Globe className="size-3.5" />
                    Website
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectCard;
