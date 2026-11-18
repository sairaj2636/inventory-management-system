
const User = require("../models/User");
const Role = require("../models/Role");
const AppError = require("../utils/AppError");

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users
    });

  } catch (error) {
    next(error);
  }
};

// Change user role
const changeUserRole = async (req, res, next) => {
  try {
    const { roleName } = req.body;
    const { id } = req.params;

    // Check whether the role exists
    const role = await Role.findOne({
      name: roleName
    });

    if (!role) {
      throw new AppError("Role not found!", 404);
    }

    if (String(id) === String(req.user.id)) {
      throw new AppError("You cannot change your own role!", 400);
    }

    // Find the user
    const user = await User.findById(id);

    if (!user) {
      throw new AppError("User not found!", 404);
    }

    // Update the user's role
    user.role = role._id;

    await user.save();

    res.status(200).json({
      message: "User role updated successfully!"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  changeUserRole
};
