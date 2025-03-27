const BtnCancel = ({ onClick }) => {
  return (
    <>
      <button className="px-4 py-2 bg-white" onClick={onClick}>
        Đóng
      </button>
    </>
  );
};

export default BtnCancel;
