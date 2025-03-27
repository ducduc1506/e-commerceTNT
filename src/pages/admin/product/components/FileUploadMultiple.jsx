import React, { useState, useEffect } from "react";

const FileUploadMultiple = ({ onImagesChange, defaultImages = [] }) => {
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]); // Lưu danh sách ảnh bị xóa

  // Chỉ thiết lập ảnh mặc định 1 lần khi component mount
  useEffect(() => {
    if (defaultImages.length > 0) {
      const initialImages = defaultImages.map((url, index) => ({
        id: `default-${index}`,
        preview: url,
        file: null, // Ảnh mặc định không có file
        isNew: false,
      }));
      setImages(initialImages);
    }
  }, []);

  // Gửi dữ liệu ảnh lên `AdminProductDetail` mỗi khi danh sách thay đổi
  useEffect(() => {
    onImagesChange(images, removedImages);
  }, [images, removedImages]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`, // ID duy nhất
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));

    // Nếu ảnh bị xóa là ảnh cũ, thêm nó vào danh sách removedImages
    const removedImage = images.find((img) => img.id === id);
    if (removedImage && !removedImage.isNew) {
      setRemovedImages((prev) => [...prev, removedImage.preview]);
    }
  };

  return (
    <div className="w-full">
      {/* File Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="hidden"
        id="file-upload-multiple"
      />
      <label
        htmlFor="file-upload-multiple"
        className="cursor-pointer flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 hover:border-black rounded-md"
      >
        Click hoặc kéo ảnh vào đây để tải lên
      </label>

      {/* Preview */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {images.map((img) => (
          <div key={img.id} className="relative w-20 h-20">
            <img
              src={img.preview}
              alt="preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(img.id)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadMultiple;
