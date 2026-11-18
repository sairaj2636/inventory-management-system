import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Dashboard.css";

function SuperAdminDashboard() {

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <h2>Welcome to Super Admin Dashboard</h2>

        <p>Manage the complete system from here.</p>

        <div className="dashboard-links">

          <div className="dashboard-card">
            <h3>Manage Products</h3>
            <p>Add, update and disable products.</p>
            <Link to="/admin/products">Manage Products</Link>
          </div>

          <div className="dashboard-card">
            <h3>Manage Inventory</h3>
            <p>Update product stock.</p>
            <Link to="/admin/inventory">Manage Inventory</Link>
          </div>

          <div className="dashboard-card">
            <h3>Manage Users</h3>
            <p>View and manage users.</p>
            <Link to="/superadmin/users">Manage Users</Link>
          </div>

          <div className="dashboard-card">
            <h3>Manage Roles</h3>
            <p>Manage user roles.</p>
            <Link to="/superadmin/roles">Manage Roles</Link>
          </div>

          <div className="dashboard-card">
            <h3>Manage Categories</h3>
            <p>Add and update product categories.</p>
            <Link to="/superadmin/categories">Manage Categories</Link>
          </div>

          <div className="dashboard-card">
            <h3>All Orders</h3>
            <p>View all customer orders.</p>
            <Link to="/superadmin/orders">View Orders</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;