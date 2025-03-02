const BtnSave = ({ name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-7 py-2 bg-black rounded-md text-white font-medium hover:bg-gray-800 transition duration-200 flex gap-1 items-center"
    >
      {name}
    </button>
  );
};

export default BtnSave;
