import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import banner from "../../../assets/images/product-page-banner.jpg";
import productService from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import Banner from "../../../components/banner/Banner";
import Pagination from "../../../components/pagination/Pagination";
import Filters from "./Filters";
import ProductList from "./ProductList";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category_id: searchParams.get("category_id") || "",
    price_range: searchParams.get("price_range") || "",
    sort: searchParams.get("sort") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: 8,
  });

  useEffect(() => {
    setFilters({
      category_id: searchParams.get("category_id") || "",
      price_range: searchParams.get("price_range") || "",
      sort: searchParams.get("sort") || "",
      page: Number(searchParams.get("page")) || 1,
      limit: 8,
    });
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]); // Chỉ theo dõi `filters`

  const fetchProducts = async () => {
    try {
      console.log("Filters before API call:", filters);
      const query = {
        ...filters,
        category_id: filters.category_id || undefined, // Loại bỏ nếu trống
      };
      const result = await productService.getAllProducts(query);
      setProducts(result?.products || []);
      setTotalPages(Math.ceil(result?.total / filters.limit) || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getAllCategories();
      setCategories(result || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1, // Reset trang khi thay đổi bộ lọc
    }));
  };

  return (
    <div className="w-full px-main-padding flex flex-col gap-8 mb-10 text-black bg-white">
      <Banner banner={banner} />
      <Filters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />
      <ProductList products={products} />
      <Pagination
        totalPages={totalPages}
        currentPage={filters.page}
        onPageChange={(page) => handleFilterChange("page", page)}
      />
    </div>
  );
};

export default Products;
