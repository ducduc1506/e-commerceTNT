const CategoryCard = ({ title, link, image }) => {
  return (
    <div className="category-container">
      <div className="mt-3">
        <h1 className="category-title">{title}</h1>
        <a className="category-link" href="#">
          {link}
        </a>
      </div>
      <div className="category-image">
        <img className="object-cover w-full h-full" src={image} alt={title} />
      </div>
    </div>
  );
};

export default CategoryCard;
