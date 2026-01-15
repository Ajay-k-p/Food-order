const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    // Optional for admin-added products - can be single restaurant or multiple
    restaurantId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    }],

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ Cloudinary image URL (IMPORTANT)
    image: {
      type: String,
      required: true, // <-- ensures image always exists
    },

    available: {
      type: Boolean,
      default: true,
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    isVeg: {
      type: Boolean,
      default: false,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
