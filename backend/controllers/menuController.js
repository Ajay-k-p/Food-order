const MenuItem = require("../models/MenuItem");

exports.getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({
      $and: [
        {
          $or: [
            { restaurantId },
            { restaurantId: null }
          ]
        },
        { available: true }
      ]
    }).sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const imageUrl =
      req.file.path || req.file.secure_url || req.file.url;

    const menuItemData = {
      name: req.body.name.trim(),
      description: req.body.description || "",
      price: Number(req.body.price),
      category: req.body.category || "",
      restaurantId:
        req.body.restaurantId && Array.isArray(req.body.restaurantId) && req.body.restaurantId.length > 0
          ? req.body.restaurantId
          : null,
      image: imageUrl,
      available:
        req.body.available !== undefined
          ? req.body.available === "true"
          : true,
      isVeg: req.body.isVeg === "true",
      isBestseller: req.body.isBestseller === "true",
    };

    const menuItem = await MenuItem.create(menuItemData);
    res.status(201).json(menuItem);
  } catch (err) {
    console.error("ADD MENU ERROR FULL:", err);
    res.status(500).json({
      message: "Failed to create product",
      error: err.message,
    });
  }
};

exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.price) updates.price = Number(req.body.price);
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.restaurantId !== undefined) updates.restaurantId = req.body.restaurantId;
    if (req.body.available !== undefined) updates.available = req.body.available === "true";
    if (req.body.isVeg !== undefined) updates.isVeg = req.body.isVeg === "true";
    if (req.body.isBestseller !== undefined) updates.isBestseller = req.body.isBestseller === "true";

    if (req.file) {
      const imageUrl = req.file.path || req.file.secure_url || req.file.url;
      updates.image = imageUrl;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByIdAndDelete(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleMenuItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    menuItem.available = !menuItem.available;
    await menuItem.save();
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
