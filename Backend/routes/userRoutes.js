
const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  changeUserRole
} = require("../controllers/userController");

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

// Get all users
router.get(
  "/",
  verifyToken,
  checkRole("SUPER ADMIN"),
  getAllUsers
);

// Change a user's role
router.put(
  "/:id/role",
  verifyToken,
  checkRole("SUPER ADMIN"),
  changeUserRole
);

module.exports = router;
