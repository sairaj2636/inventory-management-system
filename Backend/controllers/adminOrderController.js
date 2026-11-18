const Order = require("../models/Order");
const { withItems } = require("./orderController");

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: await withItems(orders, "name price") });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders };
