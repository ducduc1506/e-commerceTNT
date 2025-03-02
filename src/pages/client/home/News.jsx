const New = () => {
  return (
    <div className="flex flex-col gap-8 mb-10">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-[40px]">Tin Tức</h1>
        <a href="#">Xem thêm</a>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-[400px] bg-gray-300"></div>
        <div className="w-full h-[400px] bg-gray-300"></div>
        <div className="w-full h-[400px] bg-gray-300"></div>
        <div className="w-full h-[400px] bg-gray-300"></div>
      </div>
    </div>
  );
};

export default New;
