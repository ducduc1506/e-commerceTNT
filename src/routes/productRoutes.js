const router = require("express").Router();
const { upload, setUploadType } = require("../middleware/multerconfig");
const ProductController = require("../controllers/productController");

// GET ALL PRODUCTS
router.get("/products", ProductController.getAll);
// GET PRODUCT BY ID
router.get("/products/:id", ProductController.getById);
// CREATE PRODUCT
router.post(
  "/products",
  setUploadType("products"),
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "sub_images", maxCount: 5 },
  ]),
  ProductController.create
);
// UPDATE PRODUCT
router.put(
  "/products/:id",
  setUploadType("products"),
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "sub_images", maxCount: 5 },
  ]),
  ProductController.update
);

// DELETE PRODUCT
router.delete("/products/:id", ProductController.delete);

module.exports = router;
