const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <div className="py-5 flex justify-center items-center text-center font-extralight">
      &copy; {date} by Dhorq
    </div>
  );
};

export default Footer;
