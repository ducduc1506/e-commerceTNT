const BtnDelete = ({ name, onClick }) => {
  return (
    <>
      <button
        className="px-4 py-2 w-1/4 text-white text-[18px] font-medium rounded-md bg-black hover:bg-gray-800 transiton duration-200"
        onClick={onClick}
      >
        {name}
      </button>
    </>
  );
};

export default BtnDelete;
