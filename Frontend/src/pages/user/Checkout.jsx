
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Checkout.css";

function Checkout() {

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasItems, setHasItems] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [addressData, cartData] = await Promise.all([
          api.get("/addresses"),
          api.get("/cart")
        ]);

        const savedAddresses = addressData.addresses || [];
        const items = cartData.items || [];

        setHasItems(items.length > 0);

        setAddresses(savedAddresses);

        if (savedAddresses.length > 0) {
          setAddressId(savedAddresses[0]._id);
        }

        const total = items.reduce((sum, item) => {
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);

        setTotalAmount(total);

      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();

  }, []);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!addressId) {
      alert("Please add and select a delivery address!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/orders", { addressId });

      setOrderPlaced(true);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="checkout-container">
        <h2>Checkout</h2>

        {orderPlaced ? (
          <>
            <h3>Your order has been placed successfully!</h3>
            <button onClick={() => navigate("/user/orders")}>
              View My Orders
            </button>
          </>
        ) : (
          <form onSubmit={handlePlaceOrder}>

            <h3>Delivery Address</h3>

            {addresses.length === 0 ? (
              <>
                <p>Please add an address before checkout.</p>
                <button
                  type="button"
                  onClick={() => navigate("/user/addresses")}
                >
                  Add Address
                </button>
              </>
            ) : (
              addresses.map((address) => (
                <label key={address._id}>
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={addressId === address._id}
                    onChange={() => setAddressId(address._id)}
                  />

                  {address.fullName} - {address.street},
                  {address.city}, {address.state} - {address.pincode}
                </label>
              ))
            )}

            {!hasItems && <p>Your cart is empty.</p>}

            <h3>Total Amount: ₹{totalAmount}</h3>

            <button
              type="submit"
              disabled={loading || addresses.length === 0 || !hasItems}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;
