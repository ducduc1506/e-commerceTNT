const Dashboard = () => {
  const orders = [
    {
      id: 25426,
      date: "Nov 8th, 2023",
      customer: "Kavin",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 25425,
      date: "Nov 7th, 2023",
      customer: "Komael",
      status: "Canceled",
      amount: "₹200.00",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 25424,
      date: "Nov 6th, 2023",
      customer: "Nikhil",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 25423,
      date: "Nov 5th, 2023",
      customer: "Shivam",
      status: "Canceled",
      amount: "₹200.00",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    {
      id: 25422,
      date: "Nov 4th, 2023",
      customer: "Shadab",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 25421,
      date: "Nov 2nd, 2023",
      customer: "Yogesh",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "https://i.pravatar.cc/40?img=6",
    },
  ];

  const getStatusColor = (status) => {
    return status === "Delivered" ? "text-blue-500" : "text-orange-500";
  };
  return (
    <>
      {/* title */}
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {/*  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Total Users</h1>
          <p className="text-4xl font-semibold">100</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Total Orders</h1>
          <p className="text-4xl font-semibold">100</p>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <h1 className="text-lg font-semibold">Total Sales</h1>
          <p className="text-4xl font-semibold">$1000</p>
        </div>
      </div>
      {/* chart */}
      <div className="flex gap-6">
        <div className="w-2/3 h-96 bg-white rounded-lg"></div>
        <div className="w-1/3 h-96 bg-white rounded-lg"></div>
      </div>
      {/* Recent Order */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <button className="text-gray-500 hover:text-gray-700">⋮</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="p-3">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="p-3">Product</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" className="w-4 h-4" />
                </td>
                <td className="p-3">Lorem Ipsum</td>
                <td className="p-3">#{order.id}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={order.avatar}
                    alt={order.customer}
                    className="w-8 h-8 rounded-full"
                  />
                  {order.customer}
                </td>
                <td
                  className={`p-3 flex items-center gap-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {order.status}
                </td>
                <td className="p-3">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
