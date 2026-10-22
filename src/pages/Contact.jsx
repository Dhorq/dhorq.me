import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { contacts, email } from "../data/contacts";
import { useReveal, useSplitReveal } from "../lib/anim";
import { useTilt3d } from "../lib/tilt3d";
import { useSectionReveal } from "../lib/pageTransition";

const channels = contacts.filter((contact) => !contact.isEmail);

/**
 * Single contact channel row with a subtle 3D tilt on fine pointers.
 */
const ContactItem = ({ contact, index }) => {
  const itemRef = useRef(null);
  useTilt3d(itemRef, { maxRotation: 4, scale: 1.01 });

  const external = contact.href.startsWith("http");

  return (
    <li
      ref={itemRef}
      data-section-reveal
      className="border-b border-line preserve-3d backface-hidden"
    >
      <a
        href={contact.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center gap-5 py-6 transition-colors duration-300 hover:bg-elev md:py-7"
      >
        <span className="label hidden sm:block">{String(index + 1).padStart(2, "0")}</span>

        <img
          src={contact.icon}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-5 shrink-0 object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />

        <span className="min-w-0 flex-1">
          <span className="label block">
            {contact.label} · {contact.platform}
          </span>
          <span className="mt-1.5 block truncate text-base font-medium md:text-lg">
            {contact.display}
          </span>
        </span>

        <ArrowUpRight
          aria-hidden="true"
          className="size-5 shrink-0 text-muted transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
        />
      </a>
    </li>
  );
};

const Contact = () => {
  const pageRef = useRef(null);
  const contactListRef = useRef(null);

  useReveal(pageRef);
  useSplitReveal(pageRef, { stagger: 0.08 });

  // Section reveal with slight 3D depth.
  useSectionReveal(contactListRef, { start: "top 82%", depth: true });

  return (
    <div
      ref={pageRef}
      className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32"
    >
      <h1
        data-split
        className="max-w-4xl text-[clamp(2.75rem,10.5vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.045em]"
      >
        Get in touch<span className="text-accent">.</span>
      </h1>

      <p
        data-reveal
        className="mt-8 max-w-xl text-base text-muted md:text-lg"
      >
        Feel free to reach out, I&rsquo;d love to connect and collaborate!
      </p>

      <a
        data-reveal
        href={email.href}
        className="group mt-14 inline-block md:mt-16"
      >
        <span className="label">
          {email.label} · {email.platform}
        </span>
        <span className="link-underline mt-2 block text-[clamp(1.2rem,4.2vw,2.6rem)] leading-tight font-bold tracking-[-0.03em] break-words">
          {email.display}
        </span>
      </a>

      <ul ref={contactListRef} className="mt-16 border-t border-line md:mt-20">
        {channels.map((contact, i) => (
          <ContactItem key={contact.platform} contact={contact} index={i} />
        ))}
      </ul>
    </div>
  );
};

export default Contact;
