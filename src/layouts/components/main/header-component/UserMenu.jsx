import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="relative group">
      <FontAwesomeIcon
        icon={faCircleUser}
        className="text-[24px] hover:text-gray-600 cursor-pointer"
      />
      <div className="absolute w-40 flex flex-col gap-2 shadow-md bg-white top-8 right-0 px-4 py-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
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
  );
};

export default UserMenu;
