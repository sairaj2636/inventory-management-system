const bcrypt = require("bcryptjs");
const Role = require("../models/Role");
const User = require("../models/User");

const roles = [
  { name: "USER", description: "Can view products and place orders" },
  { name: "ADMIN", description: "Can manage products and inventory" },
  { name: "SUPER ADMIN", description: "Can manage users, roles, categories and orders" }
];

const seedRoles = async () => {
  for (const role of roles) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true });
  }
  console.log("Roles ready.");

  // Ensure a SUPER ADMIN exists so the system is usable out of the box
  const email = (process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com").toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@123";
  const superRole = await Role.findOne({ name: "SUPER ADMIN" });

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      username: process.env.SUPER_ADMIN_NAME || "Super Admin",
      email,
      password: await bcrypt.hash(password, 10),
      role: superRole._id
    });
    console.log(`Default SUPER ADMIN created: ${email}`);
  }
};

module.exports = seedRoles;
