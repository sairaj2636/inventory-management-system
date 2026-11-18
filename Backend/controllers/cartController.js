
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const AppError = require("../utils/AppError");

// Get user's cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    const items = (await CartItem.find({ cart: cart._id })
      .populate("product", "name price isActive"))
      .filter((item) => item.product);

    res.status(200).json({
      cart,
      items
    });

  } catch (error) {
    next(error);
  }
};

// Add product to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      throw new AppError("Please provide a valid product and quantity!", 400);
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true
    });

    if (!product) {
      throw new AppError("Product not found or disabled!", 404);
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    // Check if product already exists in cart
    let item = await CartItem.findOne({
      cart: cart._id,
      product: productId
    });

    const inventory = await Inventory.findOne({ product: productId });
    const available = inventory ? inventory.quantity : 0;
    const wanted = Number(quantity) + (item ? item.quantity : 0);

    if (wanted > available) {
      throw new AppError(
        `Only ${available} unit(s) of ${product.name} available in stock!`,
        400
      );
    }

    if (item) {
      item.quantity = wanted;
      await item.save();
    } else {
      item = await CartItem.create({
        cart: cart._id,
        product: productId,
        quantity: Number(quantity)
      });
    }

    res.status(200).json({
      message: "Product added to cart!",
      item
    });

  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      throw new AppError("Quantity must be at least 1!", 400);
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      throw new AppError("Cart not found!", 404);
    }

    const existing = await CartItem.findOne({
      _id: req.params.itemId,
      cart: cart._id
    });

    if (!existing) {
      throw new AppError("Cart item not found!", 404);
    }

    const inventory = await Inventory.findOne({ product: existing.product });
    const available = inventory ? inventory.quantity : 0;

    if (Number(quantity) > available) {
      throw new AppError(`Only ${available} unit(s) available in stock!`, 400);
    }

    existing.quantity = Number(quantity);
    const item = await existing.save();

    res.status(200).json({
      message: "Cart quantity updated!",
      item
    });

  } catch (error) {
    next(error);
  }
};

// Remove item from cart
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      throw new AppError("Cart not found!", 404);
    }

    const item = await CartItem.findOneAndDelete({
      _id: req.params.itemId,
      cart: cart._id
    });

    if (!item) {
      throw new AppError("Cart item not found!", 404);
    }

    res.status(200).json({
      message: "Product removed from cart!"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};
