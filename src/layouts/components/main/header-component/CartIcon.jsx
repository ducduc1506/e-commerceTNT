import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const navigate = useNavigate();

  return (
    <FontAwesomeIcon
      icon={faCartShopping}
      className="text-[24px] hover:text-gray-600 cursor-pointer"
      onClick={() => navigate("/cart")}
    />
  );
};

export default CartIcon;
