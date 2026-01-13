const Order = require("../models/Order");

/* =========================================================
   CREATE ORDER (USER)
========================================================= */
exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order for user:', req.user.id);
    console.log('Request body:', req.body);

    const {
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      expectedDeliveryDate,
      expectedDeliveryTime
    } = req.body;

    console.log('Extracted data:', {
      restaurantId,
      restaurantName,
      itemsCount: items?.length,
      totalAmount,
      deliveryAddress
    });

    const order = await Order.create({
      user: req.user.id, // This should be ObjectId string
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      paymentStatus: "paid", // payment already completed
      orderStatus: "confirmed",
      deliveryAddress,
      expectedDeliveryDate,
      expectedDeliveryTime,
      isRead: false
    });

    console.log('Order created successfully:', order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   GET LOGGED-IN USER ORDERS (VERY IMPORTANT)
========================================================= */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   UPDATE ORDER STATUS (ADMIN)
========================================================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   MARK ORDER AS READ (ADMIN)
========================================================= */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   UPDATE DELIVERY TIME (ADMIN)
========================================================= */
exports.updateDeliveryTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { expectedDeliveryDate, expectedDeliveryTime } = req.body;

    const order = await Order.findByIdAndUpdate(id, {
      expectedDeliveryDate,
      expectedDeliveryTime
    }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
