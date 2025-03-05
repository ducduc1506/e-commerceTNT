const { CartItem, Cart, Product, ProductSize } = require("../models");

class CartService {
  static async addToCart(user_id, product_id, size_id, quantity) {
    try {
      console.log("Debug - size_id:", size_id);
      console.log("Debug - product_id:", product_id);
      // Kiểm tra size có tồn tại không
      const productSize = await ProductSize.findOne({
        where: { id: size_id, product_id },
      });

      if (!productSize) {
        return { status: 404, message: "Size của sản phẩm không tồn tại" };
      }

      // Kiểm tra tồn kho
      if (quantity > productSize.quantity) {
        return {
          status: 400,
          message: `Chỉ còn ${productSize.quantity} sản phẩm trong kho`,
        };
      }

      // Kiểm tra giỏ hàng của user
      let cart = await Cart.findOne({ where: { user_id } });
      if (!cart) {
        cart = await Cart.create({ user_id });
      }

      // Kiểm tra sản phẩm trong giỏ hàng
      let cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id, size_id },
      });

      if (cartItem) {
        if (cartItem.quantity + quantity > productSize.quantity) {
          return {
            status: 400,
            message: `Không thể thêm quá số lượng tồn kho (${productSize.quantity})`,
          };
        }

        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await CartItem.create({
          cart_id: cart.id,
          product_id,
          size_id,
          quantity,
        });
      }

      return { status: 200, message: "Thêm vào giỏ hàng thành công" };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Lỗi server" };
    }
  }

  static async getCart(userId) {
    return await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [
            { model: Product, as: "product" },
            { model: ProductSize, as: "productSize" },
          ],
        },
      ],
    });
  }

  static async updateQuantity(cartItemId, quantity) {
    try {
      const cartItem = await CartItem.findByPk(cartItemId, {
        include: [
          {
            model: ProductSize,
            as: "productSize",
            attributes: ["size", "quantity"],
          },
        ],
      });

      if (!cartItem) throw new Error("Sản phẩm không tồn tại trong giỏ hàng");

      // Kiểm tra số lượng tồn kho
      if (cartItem.ProductSize && quantity > cartItem.ProductSize.quantity) {
        throw new Error(
          `Chỉ còn ${cartItem.ProductSize.quantity} sản phẩm trong kho`
        );
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      return cartItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async removeItem(cartItemId) {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) throw new Error("Sản phẩm không tồn tại trong giỏ hàng");

    await cartItem.destroy();
  }

  static async toggleSelectItem(cartItemId, selected) {
    try {
      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) throw new Error("Sản phẩm không tồn tại trong giỏ hàng");

      cartItem.selected = selected;
      await cartItem.save();
      return cartItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async clearCart(userId) {
    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });

      if (!cart) {
        return { message: "Giỏ hàng đã trống" };
      }

      await CartItem.destroy({ where: { cart_id: cart.id } });

      return { message: "Đã xóa toàn bộ giỏ hàng" };
    } catch (error) {
      console.error(error);
      throw new Error("Lỗi khi xóa giỏ hàng");
    }
  }
}

module.exports = CartService;
