import TextInput from "../../../../components/input/TextInput";

const Size = ({ size, idSize, value, onChange }) => {
  // const handleChange = (e) => {
  //   const newValue = e.target.value ? parseInt(e.target.value) : 0;
  //   onChange(size, newValue); // 🟢 Đảm bảo gọi onChange với giá trị cập nhật
  // };

  return (
    <div>
      <p>{size}:</p>
      <TextInput
        id={idSize}
        value={value}
        placeholder="Số lượng"
        onChange={onChange} // 🟢 Sử dụng handleChange
      />
    </div>
  );
};

export default Size;
