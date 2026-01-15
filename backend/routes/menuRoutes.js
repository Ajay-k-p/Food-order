const express = require("express");
const {
  getMenuItemsByRestaurant,
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} = require("../controllers/menuController");

const auth = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary"); // ✅ multer + cloudinary

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Get menu items by restaurant (public)
router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);

/* ================= ADMIN ROUTES ================= */

// Authentication required
router.use(auth);

// Admin role check
router.use((req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin role required." });
  }
  next();
});

// Get all menu items (admin)
router.get("/", getAllMenuItems);

// ✅ Add menu item (IMAGE REQUIRED)
router.post(
  "/",
  upload.single("image"), // 🔥 REQUIRED for Cloudinary upload
  addMenuItem
);

// ✅ Update menu item (IMAGE OPTIONAL)
router.put(
  "/:id",
  upload.single("image"), // 🔥 Allows updating image
  updateMenuItem
);

// Delete menu item
router.delete("/:id", deleteMenuItem);

// Toggle availability
router.put("/:id/toggle", toggleMenuItemAvailability);

module.exports = router;
