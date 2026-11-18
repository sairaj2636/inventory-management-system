require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedRoles = require("./config/seedRoles");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Copy .env.example to .env first.");
    process.exit(1);
  }

  try {
    await connectDB();
    await seedRoles();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
