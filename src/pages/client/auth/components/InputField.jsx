import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const InputField = ({ type, placeholder, onChange, isPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative">
        <input
          className="w-full outline-none py-2 border-b border-gray-300"
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          onChange={onChange}
        />{" "}
        {isPassword && (
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className="absolute text-[14px] top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </>
  );
};

export default InputField;
