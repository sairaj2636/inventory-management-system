
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const data = await api.get("/orders");

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

      <div className="orders-container">
        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <h3>You have not placed any orders yet.</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>

                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>

                  <td>
                    {(order.items || [])
                      .map((i) => `${i.product?.name || "Product"} x${i.quantity}`)
                      .join(", ")}
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

export default Orders;
