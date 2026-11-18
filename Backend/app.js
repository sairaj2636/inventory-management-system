
const express = require("express");
const cors = require("cors");

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const userRoutes = require("./routes/userRoutes");

// Import error middleware
const errorMiddleware = require("./middlewares/errorMiddleware");

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true }));
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Product Order Management API is running!"
  });
});

// Connect routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/users", userRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found!" });
});

// Global error middleware (must be last)
app.use(errorMiddleware);

module.exports = app;
