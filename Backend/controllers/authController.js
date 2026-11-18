
const User = require("../models/User");
const Role = require("../models/Role");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const { registerSchema, loginSchema } = require("../utils/validation");

// Register User
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("User already exists!", 409);
    }

    // Find USER role
    const userRole = await Role.findOne({ name: "USER" });

    if (!userRole) {
      throw new AppError("USER role not found!", 500);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole._id
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    next(error);
  }
};

// Login User
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      throw new AppError("Invalid email or password!", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password!", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      role: user.role.name,
      username: user.username
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};
