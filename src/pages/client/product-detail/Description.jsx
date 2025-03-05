const Description = ({ desc }) => {
  return (
    <div
      className="bg-gray-200 p-4 rounded-md"
      dangerouslySetInnerHTML={{ __html: desc }}
    />
  );
};

export default Description;
