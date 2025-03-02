import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice"; // Import action logout
import { useNavigate } from "react-router-dom";

import NavItem from "../../../components/nav-items/NavItem";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Chuyển về trang login sau khi đăng xuất
  };

  return (
    <header className="w-full">
      <div className="max-w-[1600px] mx-auto px-main-padding h-[60px] flex flex-row justify-between items-center py-2 bg-white text-[#000]">
        <div className="">
          <h1 className="text-5xl font-bold">TNT</h1>
        </div>
        <div>
          <nav className="flex flex-row gap-10 text-[18px] font-[400] text-gray-900">
            <NavItem className="hover:text-gray-600" Content="Home" />
            <NavItem className="hover:text-gray-600" Content="About" />
            <NavItem className="hover:text-gray-600" Content="Services" />
            <NavItem className="hover:text-gray-600" Content="Contact" />
          </nav>
        </div>
        <div className="flex flex-row gap-4 relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-[24px] hover:text-gray-600 cursor-pointer"
          />
          <div className="relative group">
            <FontAwesomeIcon
              icon={faCircleUser}
              className="text-[24px] hover:text-gray-600 cursor-pointer"
            />
            <div className="absolute w-40 flex flex-col gap-2 shadow-productCard bg-white top-8 right-0 px-4 py-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              {user ? (
                <>
                  <a className="hover:text-gray-700" href="/profile">
                    Thông tin
                  </a>
                  {user.role === "admin" && (
                    <a className="hover:text-gray-700" href="/admin">
                      Quản lý
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-700 text-left"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <a className="hover:text-gray-700" href="/login">
                    Đăng Nhập
                  </a>
                  <a className="hover:text-gray-700" href="/register">
                    Đăng Ký
                  </a>
                </>
              )}
            </div>
          </div>
          <FontAwesomeIcon
            icon={faCartShopping}
            className="text-[24px] hover:text-gray-600 cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
