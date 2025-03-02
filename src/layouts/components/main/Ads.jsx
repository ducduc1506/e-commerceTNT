const Ads = () => {
  return (
    // Use a separate flex container for Ads
    <div className="w-full bg-gray-300">
      <div className="h-[40px] flex justify-center items-center">
        <p className="font-semibold text-[14px] w-full text-center">
          30% of storewide - Limited time!{" "}
          <a className="text-blue-500 decoration-inherit" href="#">
            Shop Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Ads;
