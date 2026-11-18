const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  toggleProductStatus
} = require("../controllers/productController");

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Get all products
router.get("/", verifyToken, getProducts);

// Add product - ADMIN and SUPER ADMIN
router.post(
  "/",
  verifyToken,
  checkRole("ADMIN", "SUPER ADMIN"),
  addProduct
);

// Update product - ADMIN and SUPER ADMIN
router.put(
  "/:id",
  verifyToken,
  checkRole("ADMIN", "SUPER ADMIN"),
  updateProduct
);

// Enable / Disable product
router.patch(
  "/:id/status",
  verifyToken,
  checkRole("ADMIN", "SUPER ADMIN"),
  toggleProductStatus
);

module.exports = router;