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

// ✅ CORS (safe for local + Vercel frontend)
const allowedOrigins = [
  process.env.FRONTEND_URL,        // http://localhost:5173
  process.env.FRONTEND_URL_PROD    // https://food-order-sepia-delta.vercel.app
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, direct browser)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked origin:", origin);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200 // ✅ FIX for legacy browsers
  })
);

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
   GLOBAL ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked this request" });
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
