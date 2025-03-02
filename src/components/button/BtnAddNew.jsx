import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BtnAddNew = ({ name, onClick }) => {
  return (
    <button
      className="px-7 py-2 bg-black rounded-md text-white font-medium hover:bg-gray-800 transition duration-200 flex gap-1 justify-center items-center"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faPlus} />
      {name}
    </button>
  );
};

export default BtnAddNew;
