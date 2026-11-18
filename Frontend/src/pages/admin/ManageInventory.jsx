
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/ManageInventory.css";

function ManageInventory() {

  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});

  const fetchInventory = async () => {

    try {

      const data = await api.get("/inventory");

      const items = data.inventory || [];

      setProducts(items);

      const stockData = {};

      items.forEach((item) => {
        stockData[item.product?._id] = item.quantity;
      });

      setStock(stockData);

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id, value) => {

    setStock({
      ...stock,
      [id]: value
    });
  };

  const updateStock = async (productId) => {

    try {

      const data = await api.put(`/inventory/${productId}`, {
        quantity: Number(stock[productId])
      });

      alert(data.message || "Stock updated successfully!");

      fetchInventory();

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="inventory-container">

        <h2>Manage Inventory</h2>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Update Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => {

              const productId = item.product?._id;

              return (
                <tr key={item._id}>

                  <td>{item.product?.name || "Unknown Product"}</td>

                  <td>{item.quantity}</td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      value={stock[productId] ?? item.quantity}
                      onChange={(event) =>
                        handleStockChange(productId, event.target.value)
                      }
                    />

                    <button
                      onClick={() => updateStock(productId)}
                    >
                      Update
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ManageInventory;
