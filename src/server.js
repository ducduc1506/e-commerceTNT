const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database.js"); // Cấu hình sequelize

const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Chỉ cho phép từ FE React
    credentials: true, // Cho phép gửi cookie, authorization header
  })
);
// app.js (hoặc server.js)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Để đọc dữ liệu JSON từ body

// Sử dụng routes
// app.use("/api", userTestRoutes);

//admin
app.use("/api", authRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api", productRoutes);

// Kết nối với cơ sở dữ liệu và khởi động server
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
