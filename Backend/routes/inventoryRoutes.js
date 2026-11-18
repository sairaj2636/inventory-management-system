
const express = require("express");

const router = express.Router();

const {
  getInventory,
  updateInventory
} = require("../controllers/inventoryController");

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Get all inventory
router.get(
  "/",
  verifyToken,
  checkRole("ADMIN", "SUPER ADMIN"),
  getInventory
);

// Update stock quantity
router.put(
  "/:productId",
  verifyToken,
  checkRole("ADMIN", "SUPER ADMIN"),
  updateInventory
);

module.exports = router;
