import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Dashboard.css";

function AdminDashboard() {

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <h2>Welcome to Admin Dashboard</h2>

        <p>Manage products and inventory here.</p>

        <div className="dashboard-links">

          <div className="dashboard-card">
            <h3>Manage Products</h3>
            <p>Add, update and disable products.</p>
            <Link to="/admin/products">Manage Products</Link>
          </div>

          <div className="dashboard-card">
            <h3>Manage Inventory</h3>
            <p>Manage product stock.</p>
            <Link to="/admin/inventory">Manage Inventory</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;