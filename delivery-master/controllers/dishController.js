const Dish = require("../models/dishModel.js")
const Owner=require("../models/ownerModel.js")
const bcrypt = require("bcrypt")
const {generateToken} = require("../utils/token.js")




const createDish = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    // Extract owner ID from authenticated request (assuming middleware sets req.owner)
    const ownerId = req.owner.id;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized. Owner not authenticated." });
    }

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required." });
    }

    // Create a new dish
    const newDish = new Dish({
      name,
      description,
      price,
      category,
      imageUrl,
      ownerId, // Associate dish with the owner
    });

    await newDish.save();

    res.status(201).json({ message: "Dish created successfully", Dish: newDish });
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



const getAllDishes = async (req, res) => {
  try {
    const { category } = req.query

    let dishes
    if (category) {
      dishes = await Dish.find({ category }).populate('category')
    } else {
      dishes = await Dish.find().populate('category')
    }

    if (dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found" })
    }

    res.status(200).json({ dishes })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}


const getDishById = async (req, res) => {
  try {
    const {dishId} = req.body

    const dish = await Dish.findById( dishId).populate("category")

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" })
    }

    res.status(200).json({ dish })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}


const updateDish = async (req, res) => {
  try {
    const { dishId } = req.body
    const { name, description, price, category, imageUrl } = req.body

    const updatedDish = await Dish.findByIdAndUpdate(
      dishId,
      { name, description, price, category, imageUrl },
      { new: true } 
    )

    if (!updatedDish) {
      return res.status(404).json({ message: "Dish not found" })
    }

    res.status(200).json({ message: "Dish updated successfully", dish: updatedDish })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}


const deleteDish = async (req, res) => {
  try {
    const { dishId } = req.body

    const deletedDish = await Dish.findByIdAndDelete(dishId)

    if (!deletedDish) {
      return res.status(404).json({ message: "Dish not found" })
    }

    res.status(200).json({ message: "Dish deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

module.exports = {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
}
