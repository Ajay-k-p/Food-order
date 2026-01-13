const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Admin User",
      email: "admin@bitebuddy.com",
      password: "admin123", // In production, hash this password
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@bitebuddy.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
