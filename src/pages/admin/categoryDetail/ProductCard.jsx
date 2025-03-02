const ProductCard = ({ image, name }) => {
  return (
    <div className="w-full h-24 flex justify-between rounded border border-gray-200 p-2 cursor-pointer hover:bg-gray-200 transition duration-200 group">
      <div className="flex gap-2 items-center">
        <div className="w-20 h-full bg-gray-400 rounded-md">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <p>{name}</p>
      </div>

      <div className="flex gap-3 group-hover:opacity-100 opacity-0 transition duration-200">
        <button className="text-blue-600">Edit</button>
        <button className="text-red-600">Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;
