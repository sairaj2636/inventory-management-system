
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Get all inventory
const getInventory = async (req, res, next) => {
  try {
    const records = await Inventory.find()
      .populate("product", "name price isActive")
      .sort({ createdAt: -1 });

    const inventory = records.filter((i) => i.product);

    res.status(200).json({
      inventory
    });

  } catch (error) {
    next(error);
  }
};

// Update product stock
const updateInventory = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (
      quantity === undefined ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      throw new AppError("Please enter a valid stock quantity!", 400);
    }

    // Check whether product exists
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError("Product not found!", 404);
    }

    // Update inventory
    const inventory = await Inventory.findOneAndUpdate(
      { product: productId },
      { quantity: Number(quantity) },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Inventory updated successfully!",
      inventory
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  updateInventory
};
