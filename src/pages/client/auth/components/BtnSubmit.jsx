const BtnSubmit = ({ name }) => {
  return (
    <button
      type="submit"
      className="mt-2 w-full py-2 bg-black hover:bg-gray-700 rounded-md text-[18px] font-medium text-white"
    >
      {name}
    </button>
  );
};

export default BtnSubmit;
