import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";

const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = debounce((value) => {
    onSearch(value.trim());
  }, 500);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-700"
      />
      <input
        className="w-80 py-2 pl-8 outline-none border border-gray-300"
        placeholder="Tìm kiếm...."
        type="text"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
