const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Định nghĩa thư mục lưu ảnh theo loại nội dung
const uploadDirectories = {
  categories: path.join(__dirname, "../../src/public/uploads/categories"),
  products: path.join(__dirname, "../../src/public/uploads/products"),
};

// Tạo thư mục nếu chưa tồn tại
Object.values(uploadDirectories).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Cấu hình storage động theo loại nội dung
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Xác định thư mục lưu ảnh từ request
    const uploadType = req.uploadType || "products"; // Mặc định là sản phẩm
    const uploadDir =
      uploadDirectories[uploadType] || uploadDirectories.products;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}${path.extname(file.originalname)}`);
  },
});

// Bộ lọc chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ file ảnh"), false);
  }
};

// Middleware để đặt loại nội dung (cần gọi trước khi `upload`)
const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type;
  next();
};

// Cấu hình multer
const upload = multer({ storage, fileFilter });

module.exports = { upload, setUploadType };
