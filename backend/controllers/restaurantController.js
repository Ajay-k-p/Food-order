const Restaurant = require("../models/Restaurant");

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    const formattedRestaurants = restaurants.map(restaurant => ({
      id: restaurant._id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      image: restaurant.image,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      featured: restaurant.featured,
      isActive: restaurant.isActive
    }));

    res.status(200).json({
      success: true,
      message: "Restaurants fetched successfully",
      data: formattedRestaurants,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    const formattedRestaurant = {
      id: restaurant._id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      image: restaurant.image,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      featured: restaurant.featured,
      isActive: restaurant.isActive
    };

    res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      data: formattedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurantData = { ...req.body };

    // Handle file upload - Cloudinary provides the URL in req.file.path
    if (req.file) {
      restaurantData.image = req.file.path;
    }

    // Convert string values to appropriate types
    if (restaurantData.rating) restaurantData.rating = Number(restaurantData.rating);
    if (restaurantData.deliveryFee) restaurantData.deliveryFee = Number(restaurantData.deliveryFee);
    if (restaurantData.featured !== undefined) restaurantData.featured = restaurantData.featured === 'true';

    const restaurant = await Restaurant.create(restaurantData);
    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: {
        id: restaurant._id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        image: restaurant.image,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee,
        featured: restaurant.featured,
        isActive: restaurant.isActive
      }
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantData = { ...req.body };

    // Handle file upload - Cloudinary provides the URL in req.file.path
    if (req.file) {
      restaurantData.image = req.file.path;
    }

    // Convert string values to appropriate types
    if (restaurantData.rating) restaurantData.rating = Number(restaurantData.rating);
    if (restaurantData.deliveryFee) restaurantData.deliveryFee = Number(restaurantData.deliveryFee);
    if (restaurantData.featured !== undefined) restaurantData.featured = restaurantData.featured === 'true';

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      restaurantData,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: {
        id: restaurant._id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        image: restaurant.image,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee,
        featured: restaurant.featured
      }
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    res.json({
      success: true,
      message: "Restaurant deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
