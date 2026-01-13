const express = require("express");
const router = express.Router();

// ✅ USE CLOUDINARY UPLOAD (IMPORTANT)
const { upload } = require("../config/cloudinary");

const {
  getAllOrders,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/adminController");

const { getDailyReport, getMonthlyReport } = require("../controllers/reportController");

const auth = require("../middleware/authMiddleware");

/* ================= AUTHENTICATION ================= */

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



/* ================= ORDERS ================= */

// GET all orders
router.get("/orders", getAllOrders);

/* ================= PRODUCTS ================= */

// GET all products
router.get("/products", getAllProducts);

// ADD product (WITH IMAGE)
router.post(
  "/products",
  upload.single("image"),
  addProduct
);

// UPDATE product (OPTIONAL IMAGE)
router.put(
  "/products/:id",
  upload.single("image"),
  updateProduct
);

// DELETE product
router.delete("/products/:id", deleteProduct);

/* ================= RESTAURANTS ================= */

// GET all restaurants
router.get("/restaurants", getAllRestaurants);

// ADD restaurant (WITH IMAGE)
router.post(
  "/restaurants",
  upload.single("image"),
  addRestaurant
);

// UPDATE restaurant (OPTIONAL IMAGE)
router.put(
  "/restaurants/:id",
  upload.single("image"),
  updateRestaurant
);

// DELETE restaurant
router.delete("/restaurants/:id", deleteRestaurant);

/* ================= REPORTS ================= */

// GET daily report
router.get("/reports/daily", getDailyReport);

// GET monthly report
router.get("/reports/monthly", getMonthlyReport);

module.exports = router;
