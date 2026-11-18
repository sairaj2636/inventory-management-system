const Product = require("../models/Product");
const Category = require("../models/Category");
const Inventory = require("../models/Inventory");
const AppError = require("../utils/AppError");

// Get products (customers only see active ones)
const getProducts = async (req, res, next) => {
  try {
    const filter = req.user.role === "USER" ? { isActive: true } : {};

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    const stock = await Inventory.find({
      product: { $in: products.map((p) => p._id) }
    }).lean();

    const stockMap = new Map(stock.map((s) => [String(s.product), s.quantity]));

    const result = products.map((p) => ({
      ...p,
      stock: stockMap.get(String(p._id)) ?? 0
    }));

    res.status(200).json({ products: result });
  } catch (error) {
    next(error);
  }
};

const parseProductBody = async (body, partial = false) => {
  const data = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) throw new AppError("Product name is required!", 400);
    data.name = name;
  } else if (!partial) {
    throw new AppError("Product name is required!", 400);
  }

  if (body.description !== undefined) data.description = String(body.description).trim();

  if (body.price !== undefined && body.price !== "") {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new AppError("Please enter a valid product price!", 400);
    }
    data.price = price;
  } else if (!partial) {
    throw new AppError("Product price is required!", 400);
  }

  if (body.category !== undefined) {
    const category = await Category.findById(body.category);
    if (!category) throw new AppError("Category not found!", 404);
    data.category = category._id;
  } else if (!partial) {
    throw new AppError("Product category is required!", 400);
  }

  return data;
};

// Add new product
const addProduct = async (req, res, next) => {
  try {
    const data = await parseProductBody(req.body);
    const product = await Product.create(data);

    // Every product gets an inventory record
    await Inventory.create({ product: product._id, quantity: 0 });

    res.status(201).json({ message: "Product added successfully!", product });
  } catch (error) {
    next(error);
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const data = await parseProductBody(req.body, true);

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!product) throw new AppError("Product not found!", 404);

    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    next(error);
  }
};

// Enable or disable product
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError("Product not found!", 404);

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({ message: "Product status updated!", product });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, addProduct, updateProduct, toggleProductStatus };
