import { useState, useEffect } from "react";

export default function FileUpload({ defaultImage, onImageChange }) {
  const [imagePreview, setImagePreview] = useState(null);

  // Khi component được render, nếu có ảnh mặc định thì set nó vào state
  useEffect(() => {
    if (defaultImage) {
      setImagePreview(defaultImage);
    }
  }, [defaultImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      // Gửi file lên component cha
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);

    // Xóa ảnh ở component cha
    if (onImageChange) {
      onImageChange(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      // Gửi file lên component cha
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  return (
    <div
      className="w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {imagePreview ? (
        <div
          className="relative w-full min-h-48 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => document.getElementById("file-upload").click()}
        >
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn mở hộp chọn ảnh khi bấm nút X
              handleRemoveImage();
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition p-4"
        >
          <p>Chọn ảnh</p>
          <p className="mt-2 text-gray-600 text-sm">
            Click hoặc kéo ảnh vào đây
          </p>
        </label>
      )}

      {/* Input file ẩn nhưng vẫn tồn tại để chọn file mới */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
