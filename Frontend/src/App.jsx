import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth, homePathFor } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import Addresses from "./pages/user/Addresses";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageInventory from "./pages/admin/ManageInventory";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import ManageUsers from "./pages/superadmin/ManageUsers";
import ManageRoles from "./pages/superadmin/ManageRoles";
import ManageCategories from "./pages/superadmin/ManageCategories";
import AllOrders from "./pages/superadmin/AllOrders";

const USER = ["USER"];
const STAFF = ["ADMIN", "SUPER ADMIN"];
const SUPER = ["SUPER ADMIN"];

const guard = (roles, element) => (
  <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
);

export default function App() {
  const { token, role } = useAuth();
  const home = token ? homePathFor(role) : "/login";

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to={home} replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to={home} replace /> : <Register />} />

      <Route path="/user/dashboard" element={guard(USER, <UserDashboard />)} />
      <Route path="/user/products" element={guard(USER, <Products />)} />
      <Route path="/user/cart" element={guard(USER, <Cart />)} />
      <Route path="/user/checkout" element={guard(USER, <Checkout />)} />
      <Route path="/user/orders" element={guard(USER, <Orders />)} />
      <Route path="/user/addresses" element={guard(USER, <Addresses />)} />

      <Route path="/admin/dashboard" element={guard(["ADMIN"], <AdminDashboard />)} />
      <Route path="/admin/products" element={guard(STAFF, <ManageProducts />)} />
      <Route path="/admin/inventory" element={guard(STAFF, <ManageInventory />)} />

      <Route path="/superadmin/dashboard" element={guard(SUPER, <SuperAdminDashboard />)} />
      <Route path="/superadmin/users" element={guard(SUPER, <ManageUsers />)} />
      <Route path="/superadmin/roles" element={guard(SUPER, <ManageRoles />)} />
      <Route path="/superadmin/categories" element={guard(SUPER, <ManageCategories />)} />
      <Route path="/superadmin/orders" element={guard(SUPER, <AllOrders />)} />

      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
