
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../services/api";
import { useAuth, homePathFor } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

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

      const data = await api.post("/auth/login", formData);

      login(data);
      navigate(homePathFor(data.role), { replace: true });

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

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
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

    </div>
  );
}

export default Login;
