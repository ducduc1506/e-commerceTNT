import Navbar from "./header-component/Navbar";
import SearchBar from "./header-component/SearchBar";
import UserMenu from "./header-component/UserMenu";
import CartIcon from "./header-component/CartIcon";

const Header = () => {
  return (
    <header className="w-full sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-[1600px] mx-auto px-main-padding h-[60px] flex justify-between items-center py-2 text-[#000]">
        {/* Logo */}
        <h1 className="text-5xl font-bold">TNT</h1>

        {/* Navbar */}
        <Navbar />

        {/* Icons */}
        <div className="flex gap-4 relative">
          <SearchBar />
          <UserMenu />
          <CartIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
