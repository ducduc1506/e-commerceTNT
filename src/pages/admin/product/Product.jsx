import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import BtnAddNew from "../../../components/button/BtnAddNew";
import Filter from "./components/Filter";
import Pagination from "../../../components/pagination/Pagination";
import SearchInput from "./components/SearchInput";
import TableProduct from "./components/TableProduct";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category_id: "",
    sort: "newest",
    search: "",
    page: 1,
    limit: 8,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const fetchProducts = async (filters) => {
    try {
      console.log("Fetching with filters:", filters);
      const result = await productService.getAllProducts(filters);
      setProducts(result?.products || []);
      setTotal(result?.total || 0);
      setTotalPages(Math.ceil(result?.total / filters.limit) || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchResults = (searchQuery) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: searchQuery,
      page: 1,
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sản phẩm</h1>
        <BtnAddNew
          name="Thêm sản phẩm"
          onClick={() => navigate("/admin/products/create")}
        />
      </div>

      <div className="w-full flex flex-col gap-8 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between">
          <Filter
            onFilterChange={(newFilters) =>
              setFilters({ ...filters, ...newFilters, page: 1 })
            }
          />
          <SearchInput onSearch={handleSearchResults} />
        </div>

        <TableProduct products={products} setProducts={setProducts} />

        <div className="flex justify-between items-center">
          <Pagination
            totalPages={totalPages}
            currentPage={filters.page}
            onPageChange={(newPage) =>
              setFilters({ ...filters, page: newPage })
            }
          />
          <p className="text-gray-700 font-medium">{total} Sản phẩm</p>
        </div>
      </div>
    </>
  );
};

export default Product;
