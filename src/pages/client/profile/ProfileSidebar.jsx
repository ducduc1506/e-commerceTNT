const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-1/4 h-full bg-gray-100 p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Profile Menu</h2>
      <ul>
        <li
          className={`p-3 cursor-pointer rounded-md ${
            activeTab === "orderlist"
              ? "bg-black text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("orderlist")}
        >
          Lịch sử mua hàng
        </li>
        <li
          className={`p-3 cursor-pointer rounded-md ${
            activeTab === "changepassword"
              ? "bg-black text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("changepassword")}
        >
          Đổi mật khẩu
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
