const Order = require("../models/Order");

/* =========================================================
   REPORTS
========================================================= */

exports.getDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
      orderStatus: { $ne: 'cancelled' }
    }).populate('restaurantId', 'name');

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate restaurant stats
    const restaurantStats = {};
    orders.forEach(order => {
      const restaurantId = order.restaurantId?._id?.toString() || order.restaurantId?.toString() || order._id.toString();
      const restaurantName = order.restaurantName || order.restaurantId?.name || 'Unknown Restaurant';

      if (!restaurantStats[restaurantId]) {
        restaurantStats[restaurantId] = {
          name: restaurantName,
          orderCount: 0,
          revenue: 0
        };
      }
      restaurantStats[restaurantId].orderCount += 1;
      restaurantStats[restaurantId].revenue += order.totalAmount;
    });

    const restaurantStatsArray = Object.values(restaurantStats);
    const topRestaurant = restaurantStatsArray.reduce((top, current) =>
      current.orderCount > (top?.orderCount || 0) ? current : top, null);

    res.json({
      date: today.toISOString().split('T')[0],
      totalOrders,
      totalRevenue,
      topRestaurant,
      restaurantStats: restaurantStatsArray
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      orderStatus: { $ne: 'cancelled' }
    }).populate('restaurantId', 'name');

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate restaurant stats
    const restaurantStats = {};
    orders.forEach(order => {
      const restaurantId = order.restaurantId?._id?.toString() || order.restaurantId?.toString() || order._id.toString();
      const restaurantName = order.restaurantName || order.restaurantId?.name || 'Unknown Restaurant';

      if (!restaurantStats[restaurantId]) {
        restaurantStats[restaurantId] = {
          name: restaurantName,
          orderCount: 0,
          revenue: 0
        };
      }
      restaurantStats[restaurantId].orderCount += 1;
      restaurantStats[restaurantId].revenue += order.totalAmount;
    });

    const restaurantStatsArray = Object.values(restaurantStats);
    const topRestaurant = restaurantStatsArray.reduce((top, current) =>
      current.orderCount > (top?.orderCount || 0) ? current : top, null);

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    res.json({
      month: monthName,
      totalOrders,
      totalRevenue,
      topRestaurant,
      restaurantStats: restaurantStatsArray
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
