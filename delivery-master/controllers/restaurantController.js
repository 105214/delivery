const Restaurant = require("../models/restaurantModel.js")
const Owner=require("../models/ownerModel.js")
const bcrypt = require("bcrypt")
const {generateToken} = require("../utils/token.js")


const createRestaurant = async (req, res) => {
  console.log("oownerrrr")
  try {
      const ownerId=req.owner.id
      console.log("ownerid",req.owner)
    const { name, address, mobile,location,description, imageUrl } = req.body
    
  console.log(ownerId,"ownerrr")

    if (!ownerId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    if (!name || !address || !mobile||!location||!description) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const newRestaurant = new Restaurant({
      name,
      address,
      mobile,
      location,
      description,
      imageUrl,
      ownerId,  
    })

    
    await newRestaurant.save()
    
    return res.status(201).json({ message: "Restaurant created successfully", newRestaurant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error })
  }
}


const getAllRestaurants = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.admin) {
      // Admin can fetch all restaurants
      const restaurants = await Restaurant.find(); // Fetch all restaurants
      return res.status(200).json({ restaurants });
    }

    // For non-admins, additional logic can be added here, such as owner-specific fetching
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// const getAllRestaurants = async (req, res) => {
//   try {
//     const restaurantId=req.restaurant.id

//     if (!restaurantId) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }
//     const restaurants = await Restaurant.find(restaurantId)
//     res.status(200).json({ restaurants })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: "Server error", error })
//   }
// }


const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.body
    console.log("id",id)
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }
    
    res.status(200).json({ restaurant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error })
  }
}


const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.body
    const { name, address,  phoneNumber, imageUrl } = req.body

   
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, address,  phoneNumber, imageUrl },
      { new: true }
    )
    
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    res.status(200).json({ message: "Restaurant updated successfully", updatedRestaurant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error })
  }
}


const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.body

    const deletedRestaurant = await Restaurant.findByIdAndDelete(id)
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    res.status(200).json({ message: "Restaurant deleted successfully", deletedRestaurant })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error })
  }
}




module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
 
}
