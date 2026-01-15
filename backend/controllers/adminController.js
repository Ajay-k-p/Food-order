const mongoose = require("mongoose");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

/* =========================================================
   ORDERS
========================================================= */

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });

    console.log('Admin orders fetched:', orders.length, 'orders');
    if (orders.length > 0) {
      console.log('First order phoneNumber:', orders[0].phoneNumber);
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   PRODUCTS
========================================================= */

exports.getAllProducts = async (req, res) => {
  try {
    const products = await MenuItem.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD PRODUCT (NO DOUBLE UPLOAD)
exports.addProduct = async (req, res) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      image: req.file.path, // ✅ Cloudinary URL
      available: req.body.available === "true",
      category: req.body.category,
      isVeg: req.body.isVeg === "true",
      isBestseller: req.body.isBestseller === "true",
      restaurantId: req.body.restaurantId && req.body.restaurantId !== "" ? (Array.isArray(req.body.restaurantId) ? req.body.restaurantId : [req.body.restaurantId]) : null,
    };

    console.log("productData:", productData);

    const product = await MenuItem.create(productData);
    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    console.error("Error details:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      available: req.body.available === "true",
      category: req.body.category,
      isVeg: req.body.isVeg === "true",
      isBestseller: req.body.isBestseller === "true",
      restaurantId: req.body.restaurantId && req.body.restaurantId !== "" ? (Array.isArray(req.body.restaurantId) ? req.body.restaurantId : [req.body.restaurantId]) : null,
    };

    if (req.file) {
      updateData.image = req.file.path; // ✅ Cloudinary URL
    }

    const product = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MenuItem.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   RESTAURANTS
========================================================= */

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRestaurant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const restaurantData = {
      name: req.body.name,
      image: req.file.path, // ✅ Cloudinary URL
      cuisine: req.body.cuisine,
      rating: Number(req.body.rating),
      deliveryTime: req.body.deliveryTime,
      deliveryFee: Number(req.body.deliveryFee),
      featured: req.body.featured === "true",
    };

    const restaurant = await Restaurant.create(restaurantData);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      rating: Number(req.body.rating),
      deliveryFee: Number(req.body.deliveryFee),
      featured: req.body.featured === "true",
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
