const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <div className="flex justify-center items-center text-center">
      &copy; {date} by Dhorq
    </div>
  );
};

export default Footer;
