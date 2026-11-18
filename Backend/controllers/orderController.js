const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Address = require("../models/Address");
const Inventory = require("../models/Inventory");

const AppError = require("../utils/AppError");

// Attach order items to a list of orders using a single query
const withItems = async (orders, productFields) => {
  const items = await OrderItem.find({
    order: { $in: orders.map((o) => o._id) }
  }).populate("product", productFields);

  return orders.map((order) => ({
    ...order.toObject(),
    items: items.filter((i) => String(i.order) === String(order._id))
  }));
};

// Get user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders: await withItems(orders, "name") });
  } catch (error) {
    next(error);
  }
};

// Place order
// Stock is reserved with atomic conditional updates and rolled back on failure,
// so this works on a standalone MongoDB (no replica set / transactions needed).
const placeOrder = async (req, res, next) => {
  const reserved = [];

  try {
    const { addressId } = req.body;

    if (!addressId) {
      throw new AppError("Please select a delivery address!", 400);
    }

    const address = await Address.findOne({ _id: addressId, user: req.user.id });
    if (!address) throw new AppError("Address not found!", 404);

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) throw new AppError("Cart is empty!", 400);

    const cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    if (cartItems.length === 0) throw new AppError("Cart is empty!", 400);

    let totalAmount = 0;

    for (const item of cartItems) {
      if (!item.product || !item.product.isActive) {
        throw new AppError("A product in your cart is unavailable!", 400);
      }
      totalAmount += item.product.price * item.quantity;
    }

    // Reserve stock atomically
    for (const item of cartItems) {
      const updated = await Inventory.findOneAndUpdate(
        { product: item.product._id, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        throw new AppError(`Insufficient stock for ${item.product.name}!`, 400);
      }

      reserved.push({ product: item.product._id, quantity: item.quantity });
    }

    const order = await Order.create({
      user: req.user.id,
      address: addressId,
      totalAmount,
      status: "CONFIRMED"
    });

    try {
      await OrderItem.insertMany(
        cartItems.map((item) => ({
          order: order._id,
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        }))
      );
    } catch (err) {
      await Order.deleteOne({ _id: order._id });
      throw err;
    }

    await CartItem.deleteMany({ cart: cart._id });

    res.status(201).json({ message: "Order placed successfully!", orderId: order._id });
  } catch (error) {
    // Give any reserved stock back
    for (const r of reserved) {
      await Inventory.updateOne({ product: r.product }, { $inc: { quantity: r.quantity } })
        .catch(() => {});
    }
    next(error);
  }
};

module.exports = { getMyOrders, placeOrder, withItems };
