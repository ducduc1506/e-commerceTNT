import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import paths from "./path";
import PrivateRoute from "./PrivateRoute";
// Main layout
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/client/auth/Register";
import Login from "../pages/client/auth/Login";
import Home from "../pages/client/home/Home";
import Products from "../pages/client/list-product/Products";
import ProductDetail from "../pages/client/product-detail/ProductDetail";
import CartPage from "../pages/client/cart/CartPage";
import CheckoutPage from "../pages/client/checkout/CheckoutPage";
import Profile from "../pages/client/profile/Profile";
import OrderListPage from "../pages/client/order/OrderListPage";
import OrderDetail from "../pages/client/order/OrderDetail";
import PaymentReturn from "../pages/client/checkout/PaymentReturn";

// Admin layout
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Category from "../pages/admin/category/Category";
import CategoryDetail from "../pages/admin/categoryDetail/CategoryDetail";
import Product from "../pages/admin/product/Product";
import CreateProduct from "../pages/admin/product/CreateProduct";
import AdminProductDetail from "../pages/admin/product/AdminProductDetail";
import Order from "../pages/admin/order/Order";
import Customer from "../pages/admin/customer/Customer";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path={paths.home} element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={paths.register} element={<Register />} />
          <Route path={paths.login} element={<Login />} />
          <Route path={paths.products} element={<Products />} />
          <Route path={paths.productDetail} element={<ProductDetail />} />
          <Route path={paths.cart} element={<CartPage />} />
          <Route path={paths.checkout} element={<CheckoutPage />} />
          <Route path={paths.profile} element={<Profile />} />
          <Route path={paths.orderlist} element={<OrderListPage />} />
          <Route path={paths.orderDetail} element={<OrderDetail />} />
          <Route path={paths.paymentReturn} element={<PaymentReturn />} />
        </Route>

        <Route
          path={paths.admin}
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path={paths.categories} element={<Category />} />
          <Route path={paths.categoriesDetail} element={<CategoryDetail />} />
          <Route path={paths.adminProduct} element={<Product />} />
          <Route path={paths.adminCreateProduct} element={<CreateProduct />} />
          <Route
            path={paths.adminProductDetail}
            element={<AdminProductDetail />}
          />
          <Route path={paths.adminOrders} element={<Order />} />
          <Route path={paths.adminUsers} element={<Customer />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
