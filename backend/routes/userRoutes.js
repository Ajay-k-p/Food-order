const express = require("express");
const { getUserOrders } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// All user routes require authentication
router.use(auth);

// Get user's orders
router.get("/orders", getUserOrders);

module.exports = router;
