import gmail from "../assets/gmail.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
import github from "../assets/github2.png";
import leetcode from "../assets/leetcode.png";

export const contacts = [
  {
    icon: gmail,
    label: "Email",
    platform: "Gmail",
    display: "ridhorifqy34@gmail.com",
    href: "mailto:ridhorifqy34@gmail.com",
    isEmail: true,
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

export const email = contacts.find((contact) => contact.isEmail);
