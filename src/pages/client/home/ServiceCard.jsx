import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckFast,
  faMoneyBill,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

const ServiceCard = () => {
  const services = [
    {
      icon: faTruckFast,
      title: "Miễn Phí Ship",
      description: "Cho đơn hàng trên 1tr",
    },
    {
      icon: faMoneyBill,
      title: "Thanh Toán",
      description: "Thanh toán khi nhận hàng",
    },
    {
      icon: faLock,
      title: "Bảo Mật",
      description: "Bảo mật thông tin khách hàng",
    },
    { icon: faPhone, title: "Hỗ Trợ", description: "Hỗ trợ 24/7" },
  ];
  return (
    <div className="w-full flex flex-row gap-4 mb-10">
      {services.map((service, index) => (
        <div
          key={index}
          className="w-1/4 flex flex-col items-center justify-center gap-2 p-4 rounded-md shadow-productCard"
        >
          <FontAwesomeIcon icon={service.icon} className="text-4xl " />
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <p className="text-sm text-center">{service.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
