
const Address = require("../models/Address");
const AppError = require("../utils/AppError");

const FIELDS = ["fullName", "phone", "street", "city", "state", "pincode"];

// Only allow known address fields (blocks overriding "user" etc.)
const pick = (body) =>
  Object.fromEntries(
    FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, String(body[f]).trim()])
  );

// Get user's addresses
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({
      user: req.user.id
    });

    res.status(200).json({
      addresses
    });

  } catch (error) {
    next(error);
  }
};

// Add new address
const addAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      pincode
    } = req.body;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      throw new AppError("Please provide all address details!", 400);
    }

    const address = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      street,
      city,
      state,
      pincode
    });

    res.status(201).json({
      message: "Address added successfully!",
      address
    });

  } catch (error) {
    next(error);
  }
};

// Update address
const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      pick(req.body),
      {
        new: true,
        runValidators: true
      }
    );

    if (!address) {
      throw new AppError("Address not found!", 404);
    }

    res.status(200).json({
      message: "Address updated successfully!",
      address
    });

  } catch (error) {
    next(error);
  }
};

// Delete address
const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      throw new AppError("Address not found!", 404);
    }

    res.status(200).json({
      message: "Address deleted successfully!"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
