import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import TextInput from "../../../components/input/TextInput";
import TextEditor from "./components/TextEditor";
import FileUpload from "./components/FileUpload";
import FileUploadMultiple from "./components/FileUploadMultiple";
import Size from "./components/Size";
import BtnCancel from "../../../components/button/BtnCancel";
import BtnSave from "../../../components/button/BtnSave";

const AdminProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(productId);
        console.log("🔍 Product Data:", data);

        const defaultSizes = ["S", "M", "L", "XL", "XXL"];

        // Chuyển đổi dữ liệu size từ API thành object map
        const sizeMap = {};
        (data.sizes || []).forEach((s) => {
          sizeMap[s.size] = s.quantity;
        });

        // Đảm bảo luôn có đủ 5 size mặc định, nếu thiếu thì thêm vào
        const updatedSizes = defaultSizes.map((size) => ({
          size,
          quantity: sizeMap[size] !== undefined ? sizeMap[size] : 0, // Mặc định là 0 nếu không có
        }));

        setProduct(data);
        setSizes(updatedSizes);
        setAdditionalImages(data.images || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Xử lý khi chọn ảnh chính mới
  const handleMainImageChange = (file) => {
    if (file) {
      console.log("📌 Main Image Selected:", file);
      setMainImage(file);
    } else {
      setMainImage(null);
    }
  };

  // Xử lý ảnh phụ
  const handleAdditionalImagesChange = (newImages, removedImagesList) => {
    setAdditionalImages(newImages);
    setRemovedImages(removedImagesList); // Lưu danh sách ảnh cần xóa
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Xóa `categoryData` trước khi gửi
      const productData = { ...product };
      delete productData.categoryData;

      // Xử lý danh sách size
      const formattedSizes = sizes.map((s) => ({
        size: s.size,
        quantity: s.quantity === "" ? 0 : parseInt(s.quantity), // Đảm bảo số nguyên
      }));
      productData.sizes = formattedSizes;

      const formData = new FormData();
      formData.append("product_data", JSON.stringify(productData));

      // Xử lý xóa ảnh
      formData.append(
        "removed_images",
        JSON.stringify(
          removedImages.map((img) =>
            img.replace(`${import.meta.env.VITE_API_URL}`, "")
          )
        )
      );

      // Xử lý ảnh chính (main image)
      if (mainImage instanceof File) {
        formData.append("main_image", mainImage);
      } else if (!product.main_image) {
        formData.append("main_image", ""); // Nếu không có ảnh mới và ảnh cũ cũng không tồn tại
      }

      // Xử lý ảnh phụ (chỉ thêm ảnh mới)
      additionalImages.forEach((img) => {
        if (img.file instanceof File) {
          formData.append("sub_images", img.file);
        }
      });

      console.log("🚀 FormData gửi lên:");
      for (let pair of formData.entries()) {
        console.log("📌", pair[0], pair[1]);
      }

      await productService.updateProduct(product.id, formData);

      alert("Cập nhật thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div>
        <button
          className="font-medium text-gray-500"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">Chỉnh sửa sản phẩm</h1>
      </div>

      <form className="w-full flex flex-col gap-6">
        <div className="flex gap-6">
          <div className="w-2/3 bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
            <h1 className="text-[18px] font-medium text-black">
              Thông tin sản phẩm
            </h1>

            <TextInput
              label="SKU"
              id="sku"
              value={product.sku}
              onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            />
            <TextInput
              label="Tên sản phẩm"
              id="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />

            <TextEditor
              defaultDes={product.description}
              onChange={(newValue) =>
                setProduct({ ...product, description: newValue })
              }
            />

            <div className="w-full">
              <p className="mb-2">Ảnh đại diện</p>
              <FileUpload
                defaultImage={
                  mainImage
                    ? URL.createObjectURL(mainImage) // Nếu có ảnh mới, hiển thị preview
                    : product.main_image
                    ? `${import.meta.env.VITE_API_URL}${product.main_image}`
                    : null
                }
                onImageChange={handleMainImageChange}
              />
            </div>

            <div className="w-full">
              <p className="mb-2">Ảnh phụ</p>
              <FileUploadMultiple
                onImagesChange={handleAdditionalImagesChange}
                defaultImages={
                  product.images
                    ? product.images.map(
                        (img) =>
                          `${import.meta.env.VITE_API_URL}${img.image_url}`
                      )
                    : []
                }
              />
            </div>
          </div>

          <div className="w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="font-medium text-black mb-4">Danh mục</p>
              <select
                name="category"
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={product.category_id}
                onChange={(e) =>
                  setProduct({ ...product, category_id: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <TextInput
                label="Giá (VNĐ)"
                id="price"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>

            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="font-medium text-black mb-4">Sizes</p>
              <div className="grid grid-cols-2 gap-4">
                {sizes.map((size, index) => (
                  <Size
                    key={index}
                    size={size.size}
                    value={size.quantity || ""}
                    onChange={(e) => {
                      const updatedSizes = sizes.map((s, i) =>
                        i === index ? { ...s, quantity: e.target.value } : s
                      );
                      setSizes(updatedSizes);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <BtnCancel onClick={() => navigate("/admin/products")} />
          <BtnSave name="Cập nhật" onClick={handleSave} />
        </div>
      </form>
    </>
  );
};

export default AdminProductDetail;
