const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-800">Xác nhận xóa</h2>
        <p className="mt-2 text-gray-600">
          Bạn có chắc chắn muốn xóa <strong>{itemName}</strong> không?
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Hủy
          </button>
          <button
            onClick={async () => {
              await onConfirm(); // Đợi onConfirm chạy xong trước khi đóng modal
              onClose(); // Đóng modal
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
