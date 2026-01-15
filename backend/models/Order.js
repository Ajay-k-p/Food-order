const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /* -------------------- RELATIONS -------------------- */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },

    restaurantName: {
      type: String,
      required: true
    },

    /* -------------------- ORDER ITEMS -------------------- */
    items: [
      {
        id: { type: String }, // frontend product id
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        image: String,
        available: Boolean,
        category: String,
        quantity: { type: Number, required: true }
      }
    ],

    /* -------------------- PAYMENT -------------------- */
    totalAmount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    /* -------------------- ORDER STATUS -------------------- */
    orderStatus: {
      type: String,
      enum: [
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ],
      default: "confirmed"
    },

    /* -------------------- DELIVERY -------------------- */
    deliveryAddress: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [/^[1-9]\d{9}$/, "Invalid phone number"]
    },

    expectedDeliveryDate: String,
    expectedDeliveryTime: String,

    /* -------------------- ADMIN -------------------- */
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
