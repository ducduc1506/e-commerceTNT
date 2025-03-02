const ROOTS = {
  HOME: "/", // Home page
  ADMIN: "/admin", // Admin page
};

const paths = {
  home: ROOTS.HOME,
  admin: ROOTS.ADMIN,

  // Home
  register: `${ROOTS.HOME}register`,
  login: `${ROOTS.HOME}login`,
  products: `${ROOTS.HOME}products`,
  productDetail: `${ROOTS.HOME}/products/:productId`,
  cart: `${ROOTS.HOME}cart`,

  // Admin
  categories: `${ROOTS.ADMIN}/categories`,
  categoriesDetail: `${ROOTS.ADMIN}/categories/:categoryId`,
  adminProduct: `${ROOTS.ADMIN}/products`,
  adminCreateProduct: `${ROOTS.ADMIN}/products/create`,
  adminProductDetail: `${ROOTS.ADMIN}/products/:productId`,
  adminOrders: `${ROOTS.ADMIN}/orders`,
  adminUsers: `${ROOTS.ADMIN}/users`,
};

export default paths;
