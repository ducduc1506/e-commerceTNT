import { Outlet } from "react-router-dom";

import Header from "./components/main/Header";
import Footer from "./components/main/Footer";
import Ads from "./components/main/Ads";

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Wrap Ads in a separate container */}
      <div className="w-full flex-none">
        <Ads />
      </div>

      {/* Main content container */}
      <div className="w-full flex flex-col items-center flex-grow">
        <Header />
        <main className="w-full flex-grow">
          <div className="max-w-[1600px] mx-auto px-main-padding flex flex-col gap-8 mb-10">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
