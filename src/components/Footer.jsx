const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <div className="py-10 flex justify-center items-center text-center font-bold text-sm">
      &copy; {date} by Dhorq
    </div>
  );
};

export default Footer;
