import {
  faCartShopping,
  faLayerGroup,
  faShirt,
  faTableColumns,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "",
      label: "Trang chủ",
      icon: <FontAwesomeIcon icon={faTableColumns} />,
    },
    {
      name: "/categories",
      label: "Quản lý danh mục",
      icon: <FontAwesomeIcon icon={faLayerGroup} />,
    },
    {
      name: "/products",
      label: "Quản lý sản phẩm",
      icon: <FontAwesomeIcon icon={faShirt} />,
    },
    {
      name: "/orders",
      label: "Quản lý đơn hàng",
      icon: <FontAwesomeIcon icon={faCartShopping} />,
    },
    {
      name: "/users",
      label: "Quản lý người dùng",
      icon: <FontAwesomeIcon icon={faUserTie} />,
    },
  ];

  // Lấy path sau "/admin/"
  const currentPath = location.pathname.replace("/admin", "");

  const [active, setActive] = useState(currentPath);

  // Cập nhật state active khi URL thay đổi
  useEffect(() => {
    setActive(currentPath);
  }, [currentPath]);

  const handleActive = (name) => {
    setActive(name);
    navigate(`/admin${name}`);
  };

  return (
    <div className="w-1/5 h-screen flex flex-col shadow-md border-gray-200 border-[1px] sticky top-0">
      <div className="w-full h-[96px] flex items-center justify-center">
        <h1 className="font-bold text-[50px]">LOGO</h1>
      </div>
      <div className="flex flex-col justify-center px-4">
        {menuItems.map((item) => {
          const isActive =
            item.name === ""
              ? currentPath === ""
              : currentPath.startsWith(item.name);

          return (
            <button
              key={item.name}
              className={`px-8 h-[50px] rounded-lg flex items-center ${
                isActive ? "bg-black text-white" : "hover:bg-black group"
              }`}
              onClick={() => handleActive(item.name)}
            >
              <h1
                className={
                  isActive ? "text-white" : "text-black group-hover:text-white"
                }
              >
                {item.icon} {item.label}
              </h1>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
