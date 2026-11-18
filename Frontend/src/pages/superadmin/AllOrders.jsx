
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/AllOrders.css";

function AllOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const data = await api.get("/admin/orders");

        setOrders(data.orders || []);

      } catch (error) {
        alert(error.message);
      }
    };

    fetchOrders();

  }, []);

  return (
    <div>
      <Navbar />

      <div className="all-orders-container">
        <h2>All Customer Orders</h2>

        {orders.length === 0 ? (
          <h3>No orders found.</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.username || "Unknown"}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AllOrders;
