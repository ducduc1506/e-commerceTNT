const express = require("express");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const OrderService = require("../services/orderService"); // Import service đặt hàng
const { Order, OrderItem, Transaction } = require("../models"); // Import model đơn hàng

const router = express.Router();

const config = {
  appid: "554",
  key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
  key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
  endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder",
};

// 📌 1️⃣ API Tạo Thanh Toán ZaloPay
router.post("/create-payment", async (req, res) => {
  try {
    const { userId, address, amount, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Giỏ hàng trống" });
    }

    const apptransid = `${moment().format("YYMMDD")}_${uuidv4().slice(0, 8)}`;

    // 🔹 Lưu giao dịch vào database (bảng transactions)
    await Transaction.create({
      apptransid,
      user_id: userId,
      address,
      amount,
      status: "pending", // Trạng thái mặc định: Đang chờ thanh toán
      payment_method: "ZaloPay",
      items,
    });

    const orderData = {
      appid: config.appid,
      apptransid,
      appuser: "demo_user",
      apptime: Date.now(),
      amount,
      embeddata: JSON.stringify({ note: "Thanh toán đơn hàng" }),
      item: JSON.stringify(items),
      description: `Thanh toán đơn hàng ${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}`,
      bankcode: "zalopayapp",
      callback_url: "https://963c-42-114-171-100.ngrok-free.app/api/callback",
    };

    const data = [
      orderData.appid,
      orderData.apptransid,
      orderData.appuser,
      orderData.amount,
      orderData.apptime,
      orderData.embeddata,
      orderData.item,
    ].join("|");

    orderData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, {
      params: orderData,
    });

    console.log("🔗 Callback URL gửi lên ZaloPay:", orderData.callback_url);
    console.log("📌 Đã lưu giao dịch vào database:", apptransid);

    if (response.data.returncode !== 1) {
      return res.status(400).json({ error: "Không thể tạo giao dịch ZaloPay" });
    }

    res.json({
      ...response.data,
      paymentUrl: response.data.orderurl,
      apptransid,
    });
  } catch (error) {
    console.error("❌ Payment Error:", error.message);
    res.status(500).json({ error: "Thanh toán thất bại" });
  }
});

// 📌 2️⃣ API Xử Lý Callback từ ZaloPay
router.post("/callback", async (req, res) => {
  try {
    const { apptransid, returncode } = req.body;
    console.log("📩 Received Callback:", req.body);

    if (returncode !== 1) {
      console.log(`❌ Thanh toán thất bại cho giao dịch: ${apptransid}`);
      return res.status(400).json({ error: "Thanh toán không thành công" });
    }

    console.log(`✅ Thanh toán thành công: ${apptransid}`);

    // 🔹 Tìm giao dịch theo apptransid
    const transaction = await Transaction.findOne({ where: { apptransid } });

    if (!transaction) {
      return res.status(404).json({ error: "Không tìm thấy giao dịch" });
    }

    // 🔹 Cập nhật trạng thái giao dịch thành công
    transaction.status = "success";
    await transaction.save();

    // 🔹 Tạo đơn hàng từ giao dịch
    const newOrder = await Order.create({
      user_id: transaction.user_id,
      address: transaction.address,
      total_price: transaction.amount,
      status: "success",
      payment_method: "ZaloPay",
    });

    // 🔹 Thêm sản phẩm vào đơn hàng
    const orderItems = transaction.items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      size_id: item.size_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    console.log(
      `✅ Đã tạo đơn hàng #${newOrder.id} sau khi thanh toán thành công.`
    );
    res.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error("❌ Lỗi callback thanh toán:", error);
    res.status(500).json({ error: "Lỗi xử lý callback thanh toán" });
  }
});

module.exports = router;
