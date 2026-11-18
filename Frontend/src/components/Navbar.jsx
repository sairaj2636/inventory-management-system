
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {

  const { role, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>

      <h2>Product Management</h2>

      <div>

        {role === "USER" && (
          <>
            <Link to="/user/dashboard">Dashboard</Link>
            <Link to="/user/products">Products</Link>
            <Link to="/user/cart">Cart</Link>
            <Link to="/user/orders">Orders</Link>
            <Link to="/user/addresses">Addresses</Link>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/inventory">Inventory</Link>
          </>
        )}

        {role === "SUPER ADMIN" && (
          <>
            <Link to="/superadmin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/inventory">Inventory</Link>
            <Link to="/superadmin/users">Users</Link>
            <Link to="/superadmin/roles">Roles</Link>
            <Link to="/superadmin/categories">Categories</Link>
            <Link to="/superadmin/orders">All Orders</Link>
          </>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
