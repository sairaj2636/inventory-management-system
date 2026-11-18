
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING"
  }
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
