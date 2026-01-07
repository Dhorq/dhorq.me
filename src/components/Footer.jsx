const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <div className="flex justify-center items-center text-center mt-15 font-extralight">
      &copy; {date} by Dhorq
    </div>
  );
};

export default Footer;
