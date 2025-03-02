const Navbar = () => {
  return (
    <>
      <div className="px-10 w-full h-[96px] shadow-md flex flex-row-reverse items-center border-gray-200 border-b-[1px] sticky top-0 bg-white z-10">
        <div className="flex gap-9 items-center">
          <div className="h-[30px] w-[30px] bg-black"></div>
          <div className="h-[30px] w-[30px] bg-black rounded-[50%]"></div>
          <div>
            <button className="bg-blue-500 text-white px-5 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
