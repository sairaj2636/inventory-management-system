
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../services/api";
import "../styles/Auth.css";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);

    try {

      await api.post("/auth/register", formData);

      alert("Registration successful!");

      navigate("/login");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>

        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password (min 6 characters)"
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </div>
  );
}

export default Register;
