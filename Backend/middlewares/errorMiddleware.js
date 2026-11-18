const { ZodError } = require("zod");

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((i) => i.message).join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format!";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value: record already exists!";
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON body!";
  }

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorMiddleware;
