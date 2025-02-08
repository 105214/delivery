const express=require('express')
const ownerAuth=require('../middleware/ownerAuth.js')
const adminAuth=require('../middleware/adminAuth.js')
const { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController')
const router=express.Router()


// to display all restaurant
router.get("/restaurantlist",adminAuth,getAllRestaurants)

// display one restaurant
router.get("/restaurant",getRestaurantById)

// add restaurant
router.post("/addrestaurant",ownerAuth,createRestaurant)

// update restaurant
router.put("/updaterestaurant",updateRestaurant)


// delete restaurant
router.delete("/deleteRestaurant",deleteRestaurant)

module.exports=router