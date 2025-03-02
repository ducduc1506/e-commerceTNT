import banner from "../../../assets/images/banner.jpg";

import Banner from "../../../components/banner/Banner";
import Introduce from "./Introduce";
import CategoryDemo from "./category-demo/CategoryDemo";
import Product from "./Product";
import ServiceCard from "./ServiceCard";
import News from "./News";
// import Test from "../../components/test/Test";

const Home = () => {
  return (
    <>
      {/* Banner */}
      <Banner banner={banner} />

      {/* Giới thiệu */}
      <Introduce />

      {/* Danh mục demo */}
      <CategoryDemo />

      <div className="border-b-2 border-gray-400 mb-10">
        {/* Sản phẩm nổi bật */}
        <Product />

        {/* Sản phẩm mới */}
        <Product />
      </div>

      {/* Dịch vụ */}
      <ServiceCard />

      {/* Tin tức */}
      <News />
    </>
  );
};

export default Home;
