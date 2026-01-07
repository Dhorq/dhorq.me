import gmail from "../assets/gmail.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
import github from "../assets/github.png";

const Contact = () => {
  return (
    <div className="flex flex-col gap-10 items-center justify-cener">
      <h2 className="text-3xl font-black">Contact</h2>
      <ul className="flex flex-col gap-7">
        <li className="flex gap-2 justify-start items-center">
          <img src={gmail} alt="Gmail" className="size-6" />
          <a
            href="mailto:example@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="underline font-sans italic"
          >
            ridhorifqy34@gmail.com
          </a>
        </li>
        <li className="flex gap-2 justify-start items-center">
          <img src={whatsapp} alt="WhatsApp" className="size-6" />
          <a
            href="https://wa.me/6281384752978"
            target="_blank"
            rel="noreferrer"
            className="underline font-sans italic"
          >
            WhatsApp
          </a>
        </li>
        <li className="flex gap-2 justify-start items-center">
          <img src={linkedin} alt="LinkedIn" className="size-6" />
          <a
            href="https://www.linkedin.com/in/ridhorifqymuhammad/"
            target="_blank"
            rel="noreferrer"
            className="underline font-sans italic"
          >
            Ridho Rifqy Muhammad
          </a>
        </li>
        <li className="flex gap-2 justify-start items-center">
          <img
            src={github}
            alt="GitHub"
            className="size-6 rounded-md brightness-750"
          />
          <a
            href="https://github.com/Dhorq"
            target="_blank"
            rel="noreferrer"
            className="underline font-sans italic"
          >
            Dhorq
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
