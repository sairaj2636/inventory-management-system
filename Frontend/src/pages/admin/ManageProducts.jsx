
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/ManageProducts.css";

function ManageProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await api.get("/products");

      setProducts(data.products || []);

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const body = { ...formData, price: Number(formData.price) };

      if (editId) {
        await api.put(`/products/${editId}`, body);
      } else {
        await api.post("/products", body);
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        category: ""
      });

      setEditId(null);

      fetchProducts();

    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (product) => {

    setEditId(product._id);

    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category?._id || product.category || ""
    });
  };

  const handleToggle = async (id) => {

    try {

      await api.patch(`/products/${id}/status`);

      fetchProducts();

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="manage-products-container">

        <h2>Manage Products</h2>

        <form onSubmit={handleSubmit}>

          <h3>{editId ? "Update Product" : "Add Product"}</h3>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <button type="submit">
            {editId ? "Update Product" : "Add Product"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  category: ""
                });
              }}
            >
              Cancel
            </button>
          )}

        </form>

        <h3>Product List</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.category?.name || "N/A"}</td>
                <td>{item.isActive ? "Active" : "Disabled"}</td>

                <td>
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  <button onClick={() => handleToggle(item._id)}>
                    {item.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ManageProducts;
