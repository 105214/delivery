const express=require("express")
const ownerAuth=require('../middleware/ownerAuth.js')
const {addDishItem, updateDishItem, deleteDishItem, getAllOrders, updateOrderStatus, createOwner, ownerLogout, ownerLogin, ownerProfile, ownerUpdate, deleteOwner } = require("../controllers/ownerController")
const router=express.Router()

// create admin profile
router.post('/addowner',createOwner)

// admin login
router.put('/ownerlogin',ownerLogin)

// admin logout
router.put('/ownerlogout',ownerAuth,ownerLogout)

// admin profile
router.get('/ownerprofile',ownerAuth,ownerProfile)

// get admin profile
router.put('/updateowner',ownerAuth,ownerUpdate)

// admin profile delete
router.delete("/deleteowner",ownerAuth,deleteOwner)

// view owner
router.post("/owneradddish",ownerAuth,addDishItem)

// all orders
router.get("/allorders",ownerAuth,getAllOrders)

// // update owner
// router.put("/updatdish",ownerAuth,updateDishItem)

// // delete owner
// router.delete("/deletedish",ownerAuth,deleteDishItem)

// uppdate order status
router.put("/orderstatus",ownerAuth,updateOrderStatus)

module.exports=router