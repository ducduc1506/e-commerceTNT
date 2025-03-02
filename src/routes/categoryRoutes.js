const router = require("express").Router();

const { upload, setUploadType } = require("../middleware/multerconfig");
const CategoryController = require("../controllers/CategoryController");

router.get("/categories", CategoryController.index);

router.get("/categories/:id", CategoryController.show);

router.post(
  "/categories",
  setUploadType("categories"),
  upload.single("image"),
  CategoryController.create
);

router.put(
  "/categories/:id",
  setUploadType("categories"),
  upload.single("image"),
  CategoryController.update
);

router.delete("/categories/:id", CategoryController.delete);

module.exports = router;
