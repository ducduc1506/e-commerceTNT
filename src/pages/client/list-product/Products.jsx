import banner from "../../../assets/images/product-page-banner.jpg";

import Banner from "../../../components/banner/Banner";

const Products = () => {
  const elements = [];

  for (let i = 0; i < 20; i++) {
    elements.push(
      <div key={i} className="w-full flex flex-col gap-2">
        <div className="w-full h-[300px] bg-gray-300"></div>
        <div className="w-full h-24 bg-gray-300"></div>
      </div>
    );
  }
  return (
    <div className="w-full px-main-padding flex flex-col gap-8 mb-10">
      <Banner banner={banner} />

      {/* Content */}
      <div className="w-full flex flex-col gap-8">
        {/* header */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4">
            <div>
              <p className="font-medium">Danh mục</p>
              <select name="categories" id="categories">
                <option value="0">Tất cả</option>
                <option value="1">Áo</option>
                <option value="2">Quần</option>
                <option value="3">Phụ kiện</option>
              </select>
            </div>
            <div>
              <p className="font-medium">Giá</p>
              <select name="price" id="price">
                <option value="0">Tất cả</option>
                <option value="1">Dưới 1 triệu</option>
                <option value="2">1 triệu - 3 triệu</option>
                <option value="3">3 triệu - 5 triệu</option>
                <option value="4">5 triệu - 10 triệu</option>
                <option value="5">Trên 10 triệu</option>
              </select>
            </div>
          </div>
          <div>
            <select name="sort" id="sort">
              <option value="0">Sắp xếp</option>
              <option value="1">Giá tăng dần</option>
              <option value="2">Giá giảm dần</option>
              <option value="3">Mới nhất</option>
              <option value="4">Bán chạy</option>
            </select>
          </div>
        </div>
        {/* content */}
        <div className="w-full grid grid-cols-4 gap-8">
          {/* product */}
          {elements}
        </div>
        {/* page */}
        <div className="flex justify-center items-center gap-2">
          <button className="w-8 h-8 bg-black text-white rounded-full">
            1
          </button>
          <button className="w-8 h-8 bg-gray-300 rounded-full">2</button>
          <p>...</p>
          <button className="w-8 h-8 bg-gray-300 rounded-full">4</button>
          <button className="w-8 h-8 bg-gray-300 rounded-full">5</button>
        </div>
      </div>
    </div>
  );
};

export default Products;
