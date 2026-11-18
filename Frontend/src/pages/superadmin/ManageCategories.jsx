
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/ManageCategories.css";

function ManageCategories() {

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await api.get("/categories");

      setCategories(data.categories || []);

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.post("/categories", { name: categoryName });

      setCategoryName("");
      fetchCategories();

    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this category?")) return;

      await api.delete(`/categories/${id}`);
      fetchCategories();

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="manage-categories-container">
        <h2>Manage Categories</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            required
          />

          <button type="submit">Add Category</button>
        </form>

        <h3>Available Categories</h3>

        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>
                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageCategories;
