
const express = require("express");

const router = express.Router();

const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Get all categories
router.get("/", verifyToken, getCategories);

// Add category - SUPER ADMIN only
router.post(
  "/",
  verifyToken,
  checkRole("SUPER ADMIN"),
  addCategory
);

// Update category - SUPER ADMIN only
router.put(
  "/:id",
  verifyToken,
  checkRole("SUPER ADMIN"),
  updateCategory
);

// Delete category - SUPER ADMIN only
router.delete(
  "/:id",
  verifyToken,
  checkRole("SUPER ADMIN"),
  deleteCategory
);

module.exports = router;
