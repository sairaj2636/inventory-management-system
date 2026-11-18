
const express = require("express");

const router = express.Router();

const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require("../controllers/addressController");

const verifyToken = require("../middlewares/authMiddleware");

// Get all addresses
router.get("/", verifyToken, getAddresses);

// Add new address
router.post("/", verifyToken, addAddress);

// Update address
router.put("/:id", verifyToken, updateAddress);

// Delete address
router.delete("/:id", verifyToken, deleteAddress);

module.exports = router;
