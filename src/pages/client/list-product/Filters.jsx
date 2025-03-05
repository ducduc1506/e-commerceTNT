const Filters = ({ filters, categories, onFilterChange }) => {
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4">
        {/* Danh mục */}
        <div>
          <p className="font-medium text-gray-700">Danh mục</p>
          <select
            value={filters.category_id || ""}
            onChange={(e) => onFilterChange("category_id", e.target.value)}
            className="bg-white text-black border border-gray-300 rounded px-2 py-1 shadow-sm"
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Giá */}
        <div>
          <p className="font-medium text-gray-700">Khoảng giá</p>
          <select
            value={filters.price_range || ""}
            onChange={(e) => onFilterChange("price_range", e.target.value)}
            className="bg-white text-black border border-gray-300 rounded px-2 py-1 shadow-sm"
          >
            <option value="">Tất cả</option>
            <option value="1">Dưới 500.000₫</option>
            <option value="2">500.000₫ - 1.000.000₫</option>
            <option value="3">1.000.000₫ - 3.000.000₫</option>
            <option value="4">3.000.000₫ - 5.000.000₫</option>
            <option value="5">5.000.000₫ - 10.000.000₫</option>
            <option value="6">Trên 10.000.000₫</option>
          </select>
        </div>
      </div>

      {/* Sắp xếp */}
      <div>
        <select
          value={filters.sort || ""}
          onChange={(e) => onFilterChange("sort", e.target.value)}
          className="bg-white text-black border border-gray-300 rounded px-2 py-1 shadow-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
