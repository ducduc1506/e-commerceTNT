import { Outlet } from "react-router-dom";

import Sidebar from "./components/admin/Sidebar";
import Navbar from "./components/admin/Navbar";

const AdminLayout = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center">
      <div className="max-w-[1600px] w-full flex">
        <Sidebar />
        <div className="w-4/5 flex flex-col">
          {/* <Navbar /> */}
          <main className="w-full min-h-screen p-6 bg-[#f3f5f7] overflow-auto">
            <div className="flex flex-col gap-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
