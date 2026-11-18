
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/Cart.css";

function Cart() {

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const data = await api.get("/cart");

      setCartItems(data.items || []);

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity });

      fetchCart();

    } catch (error) {
      alert(error.message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);

      fetchCart();

    } catch (error) {
      alert(error.message);
    }
  };

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div>
      <Navbar />

      <div className="cart-container">
        <h2>My Cart</h2>

        {cartItems.length === 0 ? (
          <h3>Your cart is empty!</h3>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <h3>{item.product?.name || "Product"}</h3>

                <p>Price: ₹{item.product?.price}</p>

                <div className="quantity-controls">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <p>
                  Subtotal: ₹{(item.product?.price || 0) * item.quantity}
                </p>

                <button
                  className="remove-button"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <h3 className="total-amount">
              Total Amount: ₹{totalAmount}
            </h3>

            <button onClick={() => navigate("/user/checkout")}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
