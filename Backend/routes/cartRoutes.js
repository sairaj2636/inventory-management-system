
const express = require("express");

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cartController");

const verifyToken = require("../middlewares/authMiddleware");

// Get user's cart
router.get("/", verifyToken, getCart);

// Add product to cart
router.post("/", verifyToken, addToCart);

// Update cart item quantity
router.put("/:itemId", verifyToken, updateCartItem);

// Remove product from cart
router.delete("/:itemId", verifyToken, removeCartItem);

module.exports = router;
