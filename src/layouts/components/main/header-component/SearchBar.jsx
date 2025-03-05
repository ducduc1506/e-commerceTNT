import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  return (
    <div className="relative flex items-center">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="text-[24px] hover:text-gray-600 cursor-pointer"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      />

      <div
        ref={searchRef}
        className={`absolute right-full top-1/2 transform -translate-y-1/2 w-64 bg-white shadow-md rounded transition-all duration-300 ${
          isSearchOpen
            ? "-translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
