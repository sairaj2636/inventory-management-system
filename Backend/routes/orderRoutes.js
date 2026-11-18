
const express = require("express");

const router = express.Router();

const {
  getMyOrders,
  placeOrder
} = require("../controllers/orderController");

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Get logged-in user's orders
router.get(
  "/",
  verifyToken,
  checkRole("USER"),
  getMyOrders
);

// Place a new order
router.post(
  "/",
  verifyToken,
  checkRole("USER"),
  placeOrder
);

module.exports = router;
