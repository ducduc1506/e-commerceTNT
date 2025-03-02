const NavItem = (props) => {
  const { className, Content } = props;
  return (
    <>
      <a href="#" className={className}>
        {Content}
      </a>
    </>
  );
};

export default NavItem;
