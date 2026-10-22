import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useTilt3d } from "../lib/tilt3d";

const normalizeUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

/**
 * Editorial project card. The preview links to the live site when one exists and
 * falls back to the repository, and the link row only renders destinations that
 * are actually available — no dead controls.
 */
const ProjectCard = ({ project, featured = false }) => {
  const githubUrl = normalizeUrl(project.link);
  const websiteUrl = normalizeUrl(project.website);
  const hasWebsite = Boolean(websiteUrl);
  const primaryUrl = hasWebsite ? websiteUrl : githubUrl;
  const primaryLabel = hasWebsite ? `Visit ${project.title}` : `View ${project.title} on GitHub`;
  const cardRef = useRef(null);

  // Subtle 3D tilt on fine pointers; disabled for reduced motion / touch.
  useTilt3d(cardRef, { maxRotation: 6, scale: 1.01 });

  return (
    <article
      ref={cardRef}
      data-reveal
      className={`group preserve-3d backface-hidden ${
        featured
          ? "md:grid md:grid-cols-12 md:items-center md:gap-10 lg:gap-14"
          : "flex flex-col"
      }`}
    >
      <a
        href={primaryUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={primaryLabel}
        tabIndex={-1}
        className={`relative block overflow-hidden border border-line bg-elev ${
          featured ? "md:col-span-7 aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        <img
          src={project.image}
          alt={`${project.title} preview`}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
          width={1600}
          height={1000}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </a>

      <div className={`flex flex-col ${featured ? "md:col-span-5" : ""}`}>
        <div className="mt-6 flex items-start justify-between gap-5">
          <h3
            className={`font-bold tracking-[-0.02em] ${
              featured ? "text-[clamp(1.75rem,3.6vw,2.75rem)]" : "text-xl"
            }`}
          >
            {project.title}
          </h3>
          <ArrowUpRight
            aria-hidden="true"
            className={`mt-1 size-5 shrink-0 text-muted transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent ${
              featured ? "size-6" : ""
            }`}
          />
        </div>

        <p
          className={`mt-3 leading-relaxed text-muted ${
            featured ? "max-w-2xl text-base min-h-18" : "text-sm min-h-18"
          }`}
        >
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-5">
          <ul className="flex flex-wrap items-center gap-2" aria-hidden="true">
            {project.tech.map((tech, i) => (
              <li key={i} className="flex items-center gap-2">
                <img
                  src={tech}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-5 object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-5">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs font-medium tracking-wide text-muted transition-colors duration-300 hover:text-ink"
            >
              GitHub
            </a>
            {hasWebsite && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-xs font-medium tracking-wide text-muted transition-colors duration-300 hover:text-ink"
              >
                Live site
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
