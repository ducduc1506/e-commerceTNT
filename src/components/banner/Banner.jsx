const Banner = ({ banner }) => {
  return (
    <div className="w-full max-h-[550px] bg-slate-200 overflow-hidden">
      <img className="w-full" src={banner} alt="banner" />
    </div>
  );
};

export default Banner;
