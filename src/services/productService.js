const { Op } = require("sequelize");
const { Product, ProductImage, Category, ProductSize } = require("../models");
const fs = require("fs");
const path = require("path");

class ProductService {
  // CHECK SKU
  static async getBySKU(sku) {
    try {
      return await Product.findOne({ where: { sku } });
    } catch (error) {
      throw error;
    }
  }

  // CREATE PRODUCT
  static async create(productData, subImages) {
    try {
      // Tạo sản phẩm
      const product = await Product.create(productData);

      // Nếu có ảnh phụ, lưu vào bảng ProductImage
      if (subImages && subImages.length > 0) {
        const imageRecords = subImages.map((image) => ({
          product_id: product.id,
          image_url: image,
        }));
        await ProductImage.bulkCreate(imageRecords);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // GET ALL PRODUCTS WITH PAGINATION
  static async getAllWithPagination({
    search,
    category_id,
    min_price,
    max_price,
    sort,
    page,
    limit,
  }) {
    try {
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (category_id) {
        const categoryIds = [category_id];
        const subCategories = await Category.findAll({
          where: { parent_id: category_id },
          attributes: ["id"],
        });

        subCategories.forEach((cat) => categoryIds.push(cat.id));
        whereClause.category_id = { [Op.in]: categoryIds };
      }

      if (min_price || max_price) {
        whereClause.price = {};
        if (min_price) whereClause.price[Op.gte] = min_price;
        if (max_price) whereClause.price[Op.lte] = max_price;
      }

      let order = [["created_at", "DESC"]];
      if (sort === "price_asc") order = [["price", "ASC"]];
      if (sort === "price_desc") order = [["price", "DESC"]];
      if (sort === "oldest") order = [["created_at", "ASC"]];

      const offset = (page - 1) * limit;

      const { rows: products, count } = await Product.findAndCountAll({
        where: whereClause,
        distinct: true,
        offset,
        limit,
        include: [
          {
            model: Category,
            as: "categoryData",
            attributes: ["id", "category_name"],
          },
          { model: ProductImage, as: "images", attributes: ["image_url"] },
          { model: ProductSize, as: "sizes", attributes: ["size", "quantity"] },
        ],
        order,
      });

      return {
        products,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit,
      };
    } catch (error) {
      throw error;
    }
  }

  // GET PRODUCT BY ID
  static async getById(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [
          {
            model: ProductImage,
            as: "images", // Danh sách ảnh phụ
            attributes: ["image_url"],
          },
          {
            model: ProductSize,
            as: "sizes", // Danh sách size & số lượng
            attributes: ["size", "quantity"],
          },
          {
            model: Category,
            as: "categoryData", // Thông tin danh mục
            attributes: ["id", "category_name"],
          },
        ],
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE PRODUCT
  static async update(id, updateData, mainImage, subImages, removedImages) {
    try {
      const product = await Product.findByPk(id, {
        include: [{ model: ProductImage, as: "images" }],
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // ===== XỬ LÝ ẢNH CHÍNH =====
      let newMainImage = product.main_image;
      if (mainImage) {
        // Xóa ảnh cũ nếu có ảnh mới
        if (product.main_image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            product.main_image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        newMainImage = `/uploads/products/${mainImage.filename}`;
      }

      // ===== CẬP NHẬT THÔNG TIN SẢN PHẨM =====
      await product.update({
        ...updateData,
        main_image: newMainImage,
      });

      // ===== XỬ LÝ ẢNH PHỤ =====
      // Xóa ảnh phụ theo danh sách removedImages
      if (removedImages && removedImages.length > 0) {
        for (const imageUrl of removedImages) {
          const oldImagePath = path.join(__dirname, "..", "public", imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        await ProductImage.destroy({
          where: { product_id: id, image_url: { [Op.in]: removedImages } },
        });
      }

      // Thêm ảnh phụ mới nếu có
      if (subImages && subImages.length > 0) {
        const newImages = subImages.map((image) => ({
          product_id: id,
          image_url: `/uploads/products/${image.filename}`,
        }));
        await ProductImage.bulkCreate(newImages);
      }

      // ===== CẬP NHẬT SIZE =====
      const { sizes } = updateData;
      if (sizes && Array.isArray(sizes)) {
        for (const { size, quantity } of sizes) {
          const existingSize = await ProductSize.findOne({
            where: { product_id: id, size },
          });
          if (existingSize) {
            await existingSize.update({ quantity });
          } else {
            await ProductSize.create({ product_id: id, size, quantity });
          }
        }

        // Xóa size không còn trong danh sách mới
        const sizeList = sizes.map((s) => s.size);
        await ProductSize.destroy({
          where: {
            product_id: id,
            size: { [Op.notIn]: sizeList },
          },
        });
      }

      const updatedProduct = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: "categoryData",
            attributes: ["id", "category_name"],
          },
          { model: ProductImage, as: "images", attributes: ["image_url"] },
          { model: ProductSize, as: "sizes", attributes: ["size", "quantity"] },
        ],
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  // DELETE PRODUCT
  static async delete(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [{ model: ProductImage, as: "images" }],
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // ===== XÓA ẢNH CHÍNH =====
      if (product.main_image) {
        const mainImagePath = path.join(
          __dirname,
          "..",
          "public",
          product.main_image
        );
        if (fs.existsSync(mainImagePath)) {
          fs.unlinkSync(mainImagePath);
        }
      }

      // ===== XÓA ẢNH PHỤ =====
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          const imagePath = path.join(
            __dirname,
            "..",
            "public",
            image.image_url
          );
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        await ProductImage.destroy({ where: { product_id: id } });
      }

      // ===== XÓA SIZE =====
      await ProductSize.destroy({ where: { product_id: id } });

      // ===== XÓA SẢN PHẨM =====
      await product.destroy();

      return { message: "Product deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
