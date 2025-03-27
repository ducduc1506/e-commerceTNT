import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TextInput from "../../../components/input/TextInput";
import TextEditor from "./components/TextEditor";
import FileUpload from "./components/FileUpload";
import BtnAddNew from "../../../components/button/BtnAddNew";
import BtnCancel from "../../../components/button/BtnCancel";
import FileUploadMultiple from "./components/FileUploadMultiple";
import Size from "./components/Size";
import useCategories from "../../../hooks/useCategories";
import useProduct from "../../../hooks/useProduct";

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    category_id: "",
    mainImage: null,
    additionalImages: [],
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  });

  const [loading, setLoading] = useState(false);
  const { categories, loading: loadingCategories } = useCategories();
  const { createProduct } = useProduct();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSizeChange = (size, newValue) => {
    setProductData((prevData) => ({
      ...prevData,
      sizes: { ...prevData.sizes, [size]: newValue || 0 },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate dữ liệu
      if (
        !productData.sku ||
        !productData.name ||
        !productData.price ||
        !productData.category_id
      ) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const formData = new FormData();

      // Xử lý sizes
      const sizesArray = Object.entries(productData.sizes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([size, quantity]) => ({
          size,
          quantity: parseInt(quantity),
        }));

      // Tạo object chứa thông tin sản phẩm
      const productInfo = {
        sku: productData.sku,
        name: productData.name,
        description: productData.description || "",
        price: parseFloat(productData.price),
        category_id: parseInt(productData.category_id),
        sizes: sizesArray,
      };

      // Append product data
      formData.append("product_data", JSON.stringify(productInfo));

      // Append main image
      if (productData.mainImage) {
        formData.append("main_image", productData.mainImage);
      }

      // Append additional images
      if (productData.additionalImages?.length > 0) {
        productData.additionalImages.forEach(({ file }) => {
          formData.append("sub_images", file);
        });
      }

      // Debug: kiểm tra dữ liệu trước khi gửi
      // console.log("Product Info:", productInfo);
      // console.log("Main Image:", productData.mainImage);
      // console.log("Additional Images:", productData.additionalImages);
      // console.log("FormData content:", formData.getAll("additional_images"));

      // Gọi API create product
      const result = await createProduct(formData);
      console.log(result);

      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div>
        <button className="font-medium text-gray-500" onClick={handleBack}>
          ← Trở về
        </button>
        <h1 className="text-2xl font-semibold">Thêm sản phẩm mới</h1>
      </div>
      <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex gap-6">
          {/* left */}
          <div className="w-2/3 bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
            <h1 className="text-[18px] font-medium text-black">
              Thông tin sản phẩm
            </h1>
            <TextInput
              label="SKU"
              id="sku"
              placeholder="SKU"
              value={productData.sku}
              onChange={(e) =>
                setProductData({ ...productData, sku: e.target.value })
              }
            />
            <TextInput
              label="Tên sản phẩm"
              id="name"
              placeholder="Tên sản phẩm"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
            />
            <TextEditor
              defaultDes={productData.description}
              onChange={(value) =>
                setProductData((prev) => ({ ...prev, description: value }))
              }
            />

            <div className="w-full">
              <p className="mb-2">Ảnh đại diện</p>
              <FileUpload
                onImageChange={(file) =>
                  setProductData((prev) => ({ ...prev, mainImage: file }))
                }
              />
            </div>
            {/* Ảnh phụ */}
            <div className="w-full">
              <p className="mb-2">Ảnh phụ</p>
              <FileUploadMultiple
                onImagesChange={(updatedImages) =>
                  setProductData((prev) => ({
                    ...prev,
                    additionalImages: updatedImages,
                  }))
                }
              />
            </div>
          </div>
          {/* right */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="font-medium text-black mb-4">Danh mục</p>
              <select
                id="categoryId"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={productData.category_id || ""}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    category_id: e.target.value,
                  })
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {loadingCategories ? (
                  <option>Đang tải danh mục...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <TextInput
                label="Price(VNĐ)"
                id="price"
                placeholder="Price"
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: e.target.value })
                }
              />
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="font-medium text-black mb-4">Sizes</p>
              <div className=" grid grid-cols-2 gap-4">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <Size
                    key={size}
                    size={size}
                    idSize={`size-${size}`}
                    value={productData.sizes[size] || ""}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* submit */}
        <div className="flex justify-end gap-4">
          <BtnCancel onClick={handleBack} />
          <BtnAddNew name="Thêm" loading={loading} disabled={loading} />
        </div>
      </form>
    </>
  );
};

export default CreateProduct;
