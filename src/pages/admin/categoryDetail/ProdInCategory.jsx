import BtnAddNew from "../../../components/button/BtnAddNew";
import ProductCard from "./ProductCard";

const ProInCategory = () => {
  return (
    <div className="w-2/3 bg-white py-4 px-3 rounded flex flex-col gap-2">
      <h1 className="text-lg font-semibold">Products</h1>
      <div className="grid grid-cols-1 gap-2">
        {[
          {
            id: 1,
            name: "Product 1",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 2,
            name: "Product 2",
            image: "https://via.placeholder.com/150",
          },
        ].map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image}
          />
        ))}
      </div>
      <BtnAddNew name="Add Product" />
    </div>
  );
};

export default ProInCategory;
