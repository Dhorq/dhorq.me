import gmail from "../assets/gmail.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
import github from "../assets/github.png";
import leetcode from "../assets/leetcode.png";
import useGlobalStore from "../stores/useGlobalStore";
import { ChevronRight } from "lucide-react";

const contacts = [
  {
    icon: gmail,
    label: "Email",
    platform: "Gmail",
    display: "ridhorifqy34@gmail.com",
    href: "mailto:ridhorifqy34@gmail.com",
  },
  {
    icon: whatsapp,
    label: "Message",
    platform: "WhatsApp",
    display: "+62 813-8475-2978",
    href: "https://wa.me/6281384752978",
  },
  {
    icon: linkedin,
    label: "Connect",
    platform: "LinkedIn",
    display: "Ridho Rifqy Muhammad",
    href: "https://www.linkedin.com/in/ridhorifqymuhammad/",
  },
  {
    icon: github,
    label: "Code",
    platform: "GitHub",
    display: "Dhorq",
    href: "https://github.com/Dhorq",
  },
  {
    icon: leetcode,
    label: "Practice",
    platform: "LeetCode",
    display: "Dhorq",
    href: "https://leetcode.com/u/8E5rUjdvno/",
  },
];

const Contact = () => {
  const darkMode = useGlobalStore((state) => state.darkMode);

  return (
    <div className="max-w-xl mx-auto px-6 py-16 pb-28 md:pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-black mb-3">Get in Touch</h1>
        <div
          className={`w-16 h-1 rounded-full mb-4 ${
            darkMode ? "bg-zinc-400" : "bg-zinc-500"
          }`}
        />
        <p
          className={`text-base ${
            darkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Feel free to reach out, I'd love to connect and collaborate!
        </p>
      </div>

      {/* Contact Cards */}
      <div className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <a
            key={contact.platform}
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              darkMode
                ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:shadow-black/30"
                : "bg-white border-zinc-200 shadow-sm hover:border-zinc-400 hover:shadow-zinc-200/80"
            }`}
          >
            {/* Icon box */}
            <div
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-800 group-hover:bg-zinc-700"
                  : "bg-zinc-100 group-hover:bg-zinc-200"
              }`}
            >
              <img
                src={contact.icon}
                alt={contact.platform}
                className="size-6 object-contain"
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-[11px] font-semibold uppercase tracking-widest mb-0.5 ${
                  darkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {contact.label} · {contact.platform}
              </p>
              <p
                className={`text-sm font-medium truncate transition-colors duration-300 ${
                  darkMode
                    ? "text-zinc-200 group-hover:text-white"
                    : "text-zinc-700 group-hover:text-zinc-900"
                }`}
              >
                {contact.display}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight
              className={`size-4 shrink-0 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 ${
                darkMode ? "text-zinc-400" : "text-zinc-400"
              }`}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
