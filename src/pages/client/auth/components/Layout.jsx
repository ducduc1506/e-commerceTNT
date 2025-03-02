import Ao from "../../../../assets/images/ao-demo.png";

const Layout = ({ children }) => {
  return (
    // <div className="w-full">
    <div className="w-full h-[600px] pt-4 flex justify-center items-center ">
      <div className="w-[900px] h-full bg-slate-100 flex  rounded-md overflow-hidden border-2 border-slate-100">
        <div className="w-1/2 h-full bg-[#f3f5f7]] flex justify-center items-center">
          <img className="w-full h-full object-cover" src={Ao} alt="bg" />
        </div>
        <div className="w-1/2 h-full px-12 bg-white flex justify-center items-center">
          {children}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Layout;
