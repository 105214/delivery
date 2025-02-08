const express=require('express')
const ownerAuth=require('../middleware/ownerAuth')
const { createDish, getAllDishes, getDishById, updateDish, deleteDish } = require('../controllers/dishController')
const router=express.Router()

// display all dishes
router.get("/alldishes",getAllDishes)
// display one dish
router.get("/getdish/:id",ownerAuth,getDishById)

// add dish
router.post("/adddish",ownerAuth,createDish)
// update dish
router.put("/updatedish",ownerAuth,updateDish)

// delete dish
router.delete("/deletedish/:id",ownerAuth,deleteDish)

module.exports=router
