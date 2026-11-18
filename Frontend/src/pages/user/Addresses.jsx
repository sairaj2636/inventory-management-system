
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../styles/Addresses.css";

function Addresses() {

  const [addresses, setAddresses] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const fetchAddresses = async () => {
    try {
      const data = await api.get("/addresses");

      setAddresses(data.addresses || []);

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
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
      await api.post("/addresses", formData);

      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
      });

      fetchAddresses();

    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="addresses-container">
        <h2>My Addresses</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Street</label>
          <textarea
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />

          <label>City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <label>State</label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />

          <label>Pincode</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Address</button>
        </form>

        <h3>Saved Addresses</h3>

        {addresses.length === 0 ? (
          <p>No addresses added yet.</p>
        ) : (
          addresses.map((item) => (
            <div className="address-card" key={item._id}>
              <h4>{item.fullName}</h4>
              <p>Phone: {item.phone}</p>
              <p>{item.street}</p>
              <p>{item.city}, {item.state} - {item.pincode}</p>

              <button onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Addresses;
