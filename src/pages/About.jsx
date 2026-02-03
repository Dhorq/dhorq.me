const About = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-10">
      <h1 className="text-2xl lg:text-3xl font-black">About</h1>
      <div className="flex text-justify flex-col gap-5 w-80 md:w-145 lg:w-150">
        <p className="leading-8 indent-15">
          My name is <strong>Ridho Rifqy Muhammad</strong>, I am a recent
          Computer Science graduate from Bina Nusantara University and
          full-stack developer with experience building end-to-end web{" "}
          <i className="text-green-400">
            applications using React.js, Express.js, PostgreSQL, MongoDB, and
            Java.
          </i>
        </p>
        <p className="leading-8 indent-15 mb-10">
          I have a solid foundation in software engineering and application
          development, with experience in building{" "}
          <i className="text-green-400">
            REST APIs, implementing JWT and cookie-based
            authentication/authorization, bcrypt password hashing, and deploying
            applications including validation and logging.
          </i>{" "}
          While my background in system analysis and data is still developing, I
          am currently highly focused on growing as a software developer. Driven
          by curiosity and a growth mindset, I am eager to pursue full-stack
          roles and continuously learn new technologies to deliver meaningful
          solutions for users.
        </p>
        <h4 className="font-bold">Academic Experiences</h4>
        <p className="leading-8 indent-15">
          Since my fifth semester, I have focused on Data Analytics, gaining
          hands-on experience through internships as a System Analyst at the
          Ministry of Finance (KEMENKEU) and as a Data Analyst at the House of
          Representatives (DPR).
        </p>
        <p className="leading-8 indent-15">
          After graduating, I developed a strong interest in Data Engineering
          and pursued it through self-directed learning to further strengthen my
          coding abilities and technical skills. I continued this learning
          journey until June.
        </p>
        <p className="leading-8 indent-15">
          Since July, I have deliberately pursued a self-taught path as a Full
          Stack Developer, driven by my passion for problem-solving and building
          meaningful solutions. I have gained hands-on experience with{" "}
          <i className="text-green-400">
            JavaScript, React, Node.js, Express, PostgreSQL, Prisma, MongoDB,
            TypeScript, and RESTful APIs, along with tools and libraries such as
            Winston, Zod, Joi, JWT, and bcrypt for authentication, validation,
            and security.
          </i>{" "}
          I am currently expanding my expertise in{" "}
          <i className="text-green-400">Java and Spring Boot</i> and remain
          committed to continuously deepening my technical skills and
          professional growth.
        </p>
      </div>
    </div>
  );
};

export default About;
