
const express = require("express");

const router = express.Router();

const {
  getAllOrders
} = require("../controllers/adminOrderController");

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Get all orders - SUPER ADMIN only
router.get(
  "/",
  verifyToken,
  checkRole("SUPER ADMIN"),
  getAllOrders
);

module.exports = router;
