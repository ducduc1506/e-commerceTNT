import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import RecentOrder from "./RecentOrder";
import orderService from "../../../services/orderService";
import productService from "../../../services/productService";

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("month"); // "day", "week", "month"
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]); // Gọi lại khi timeFilter thay đổi

  const fetchDashboardData = async () => {
    try {
      const orders = await orderService.getAllOrders();
      const products = await productService.getAllProducts();
      console.log("products", products);

      setTotalOrders(orders.length);
      setTotalProducts(products.products.length);

      // Tính tổng doanh thu từ tất cả đơn hàng
      const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
      setTotalRevenue(revenue);

      processRevenueData(orders);
      processOrderStatusData(orders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const processRevenueData = (orders) => {
    const revenue = {};

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      let key = "";

      if (timeFilter === "day") {
        key = date.toLocaleDateString("vi-VN"); // 07/03/2025
      } else if (timeFilter === "week") {
        const week = getWeekNumber(date);
        key = `Tuần ${week} (${date.getFullYear()})`;
      } else {
        key = date.toLocaleString("vi-VN", { month: "short", year: "numeric" }); // Th3 2025
      }

      revenue[key] = (revenue[key] || 0) + order.total_price;
    });

    const formattedData = Object.keys(revenue).map((key) => ({
      name: key,
      revenue: revenue[key],
    }));

    setRevenueData(formattedData);
  };

  const processOrderStatusData = (orders) => {
    const statusCounts = {};
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const translatedStatus = {
      delivered: "Đã giao",
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      cancelled: "Đã hủy",
    };

    const formattedData = Object.keys(statusCounts).map((status) => ({
      name: translatedStatus[status] || "Không xác định",
      value: statusCounts[status],
    }));
    setOrderStatusData(formattedData);
  };

  const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff =
      date -
      start +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  };

  const COLORS = ["#4CAF50", "#FFC107", "#FF5722", "#F44336"];

  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Tổng người dùng</h1>
          <p className="text-4xl font-semibold">100</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Tổng đơn hàng</h1>
          <p className="text-4xl font-semibold">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Tổng doanh thu</h1>
          <p className="text-4xl font-semibold">
            {totalRevenue.toLocaleString()} đ
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Sản phẩm đang bán</h1>
          <p className="text-4xl font-semibold">{totalProducts}</p>
        </div>
      </div>

      {/* Hai biểu đồ đứng cạnh nhau */}
      <div className="flex gap-6 mt-6">
        {/* Biểu đồ doanh thu theo thời gian */}
        <div className="w-2/3 h-96 bg-white rounded-lg p-4 flex flex-col">
          {/* Bộ lọc thời gian */}
          <div className="flex mb-4">
            <label className="mr-2 font-medium">Thống kê theo:</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
            </select>
          </div>

          <h2 className="text-lg font-semibold mb-4">
            Doanh thu (
            {timeFilter === "day"
              ? "Ngày"
              : timeFilter === "week"
              ? "Tuần"
              : "Tháng"}
            )
          </h2>

          {/* Đảm bảo biểu đồ không bị tụt */}
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ trạng thái đơn hàng */}
        <div className="w-1/3 h-96 bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            Tỷ lệ trạng thái đơn hàng
          </h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <RecentOrder />
    </>
  );
};

export default Dashboard;
