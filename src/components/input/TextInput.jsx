const TextInput = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div className=" flex flex-col gap-2">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      className="px-3 py-2 border border-gray-300 rounded-md outline-none"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default TextInput;
