const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  markAsRead,
  updateDeliveryTime
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/my-orders", auth, getUserOrders);
router.put("/:id/status", auth, updateOrderStatus);
router.put("/:id/read", auth, markAsRead);
router.put("/:id/delivery", auth, updateDeliveryTime);

module.exports = router;
