const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

// ✅ CORS (safe for dev + prod)
app.use(cors());

// ✅ JSON (for non-file routes ONLY)
app.use(express.json());

// ✅ URL encoded (forms without files)
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   ROUTES
========================================================= */

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

/* =========================================================
   GLOBAL ERROR HANDLER (🔥 VERY IMPORTANT)
========================================================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  // Multer / Cloudinary errors
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: err.message || "Server error" });
});

/* =========================================================
   DATABASE CONNECTION
========================================================= */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/* =========================================================
   SERVER START
========================================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});
