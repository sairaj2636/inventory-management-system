
const Category = require("../models/Category");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      categories
    });

  } catch (error) {
    next(error);
  }
};

// Add category
const addCategory = async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const { description } = req.body;

    if (!name) {
      throw new AppError("Category name is required!", 400);
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new AppError("Category already exists!", 409);
    }

    const category = await Category.create({
      name,
      description
    });

    res.status(201).json({
      message: "Category added successfully!",
      category
    });

  } catch (error) {
    next(error);
  }
};

// Update category
const updateCategory = async (req, res, next) => {
  try {
    const update = {};
    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();
      if (!name) throw new AppError("Category name is required!", 400);
      update.name = name;
    }
    if (req.body.description !== undefined) update.description = req.body.description;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new AppError("Category not found!", 404);
    }

    res.status(200).json({
      message: "Category updated successfully!",
      category
    });

  } catch (error) {
    next(error);
  }
};

// Delete category
const deleteCategory = async (req, res, next) => {
  try {
    const inUse = await Product.exists({ category: req.params.id });

    if (inUse) {
      throw new AppError("Cannot delete a category that has products!", 409);
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new AppError("Category not found!", 404);
    }

    res.status(200).json({
      message: "Category deleted successfully!"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
