
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function UserDashboard() {

  return (
    <div>

      <Navbar />

      <div className="dashboard-container">

        <h2>Welcome to User Dashboard</h2>

        <p>Manage your shopping and orders here.</p>

        <div className="dashboard-links">

          <div className="dashboard-card">
            <h3>Products</h3>
            <p>View available products.</p>
            <Link to="/user/products">View Products</Link>
          </div>

          <div className="dashboard-card">
            <h3>My Cart</h3>
            <p>Manage your cart items.</p>
            <Link to="/user/cart">View Cart</Link>
          </div>

          <div className="dashboard-card">
            <h3>My Orders</h3>
            <p>Check your previous orders.</p>
            <Link to="/user/orders">View Orders</Link>
          </div>

          <div className="dashboard-card">
            <h3>My Addresses</h3>
            <p>Manage delivery addresses.</p>
            <Link to="/user/addresses">Manage Addresses</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;
