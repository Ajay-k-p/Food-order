const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  image: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  deliveryTime: { type: String, required: true },
  deliveryFee: { type: Number, required: true, min: 0 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
