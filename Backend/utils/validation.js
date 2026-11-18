const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username must contain at least 3 characters"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(6, "Password must contain at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required")
});

module.exports = { registerSchema, loginSchema };
