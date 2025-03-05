const NavItem = (props) => {
  const { className, Content, onClick } = props;
  return (
    <>
      <button onClick={onClick} className={className}>
        {Content}
      </button>
    </>
  );
};

export default NavItem;
