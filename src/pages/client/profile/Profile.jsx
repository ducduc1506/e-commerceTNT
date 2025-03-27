import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import OrderListPage from "../../../pages/client/order/OrderListPage";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orderlist");

  return (
    <div className="mt-4 flex h-screen shadow-md rounded-md">
      {/* Sidebar */}
      <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Nội dung thay đổi */}
      <div className="flex-1 p-6">
        {activeTab === "orderlist" && <OrderListPage />}
        {activeTab === "changepassword" && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
