
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/Products.css";

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");

  const fetchProducts = async () => {
    try {
      const data = await api.get("/products");

      setProducts((data.products || []).filter((item) => item.isActive));

    } catch (error) {
      alert(error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get("/categories");

      setCategories(data.categories || []);

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = category === "All"
    ? products
    : products.filter((item) =>
        (item.category?._id || item.category) === category
      );

  const handleAddToCart = async (product) => {
    try {
      const data = await api.post("/cart", {
        productId: product._id,
        quantity: 1
      });

      alert(data.message || "Product added to cart!");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="products-container">
        <h2>Available Products</h2>

        <label>Select Category: </label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="All">All</option>

          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <div className="products-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <h3>{product.name}</h3>

              {product.description && <p>{product.description}</p>}

              <p>Price: ₹{product.price}</p>

              <p>{product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}</p>

              <p>
                Category: {product.category?.name || "N/A"}
              </p>

              <button
                disabled={!(product.stock > 0)}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
