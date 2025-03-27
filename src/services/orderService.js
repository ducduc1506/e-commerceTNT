const {
  Order,
  OrderItem,
  Cart,
  CartItem,
  Product,
  ProductSize,
  sequelize,
  User,
} = require("../models");

class OrderService {
  static async createOrder(userId, address, totalPrice, status) {
    const transaction = await sequelize.transaction();

    try {
      const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: "cartItems",
            where: { selected: true },
            include: [
              { model: ProductSize, as: "productSize" },
              { model: Product, as: "product", attributes: ["id", "price"] }, // ✅ Thêm Product để lấy price
            ],
          },
        ],
      });

      if (!cart || cart.cartItems.length === 0) {
        throw new Error("Giỏ hàng trống hoặc chưa chọn sản phẩm để đặt hàng.");
      }

      // 🔹 Tạo đơn hàng với totalPrice từ frontend
      const order = await Order.create(
        {
          user_id: userId,
          total_price: Number(totalPrice), // Chuyển thành số để tránh lỗi
          status: status || "pending",
          address,
        },
        { transaction }
      );

      for (const item of cart.cartItems) {
        await OrderItem.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price: item.product.price || 0,
          },
          { transaction }
        );

        await ProductSize.update(
          { quantity: sequelize.literal(`quantity - ${item.quantity}`) },
          { where: { id: item.size_id }, transaction }
        );
      }

      // Xóa các sản phẩm đã đặt khỏi giỏ hàng
      await CartItem.destroy({
        where: { cart_id: cart.id, selected: true },
        transaction,
      });

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
              },
              {
                model: ProductSize,
                as: "size",
              },
            ],
          },
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return orders;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
      throw new Error("Lỗi khi lấy danh sách đơn hàng");
    }
  }

  static async getUserOrders(userId) {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items", // Đảm bảo alias đúng với định nghĩa trong model
          include: [
            { model: Product, as: "product" },
            { model: ProductSize, as: "size" }, // ⚠ Thêm Size vào truy vấn
          ],
        },
      ],
    });

    return orders;
  }

  static async getOrderById(orderId, userId) {
    try {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId }, // Đảm bảo user chỉ xem đơn của mình
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["name", "main_image"],
              },
              { model: ProductSize, as: "size", attributes: ["size"] },
            ],
          },
        ],
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng hoặc bạn không có quyền xem");
      }

      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async cancelOrder(orderId, userId) {
    const transaction = await sequelize.transaction(); // ✅ Dùng transaction để đảm bảo dữ liệu nhất quán

    try {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [{ model: ProductSize, as: "size" }], // ✅ Lấy ProductSize để hoàn số lượng
          },
        ],
      });

      if (!order) {
        throw new Error(
          "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy đơn này"
        );
      }

      if (order.status !== "pending") {
        throw new Error("Chỉ có thể hủy đơn hàng khi trạng thái là 'pending'");
      }

      // ✅ Hoàn lại số lượng sản phẩm vào kho
      for (const item of order.items) {
        if (item.size) {
          await ProductSize.update(
            { quantity: sequelize.literal(`quantity + ${item.quantity}`) },
            { where: { id: item.size.id }, transaction }
          );
        }
      }

      // Cập nhật trạng thái đơn hàng
      await order.update({ status: "cancelled" }, { transaction });

      await transaction.commit();

      return {
        message: "Đơn hàng đã bị hủy và số lượng sản phẩm đã được hoàn lại",
        order,
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
    }
  }

  static async updateOrderStatus(orderId, newStatus) {
    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Cập nhật trạng thái tự do, không ràng buộc điều kiện
      await order.update({ status: newStatus });

      return {
        message: `Đã cập nhật trạng thái đơn hàng thành ${newStatus}`,
        order,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = OrderService;
