const express=require('express')
const adminAuth=require("../middleware/adminAuth.js")
const { addRestaurant, addMenuItem, getAllOrders, updateOrderStatus, getAllUsers, deleteRestaurant, deleteMenuItem, createAdmin, adminLogin, adminLogout, adminProfile, adminUpdate, deleteAdminProfile } = require('../controllers/adminController')
const router=express.Router()

// create admin profile
router.post('/addadmin',createAdmin)

// admin login
router.put('/adminlogin',adminLogin)

// admin logout
router.put('/adminlogout',adminAuth,adminLogout)

// admin profile
router.get('/adminprofile',adminAuth,adminProfile)

// get admin profile
router.put('/updateadmin',adminAuth,adminUpdate)

// admin profile delete
router.delete("/deleteadmin",adminAuth,deleteAdminProfile)

// add restaurant
router.post('/addrestaurant',adminAuth, addRestaurant)

// add menuitem
router.post("/addmenuitem",adminAuth,addMenuItem)
// getallorders
router.get("/orderlist",adminAuth,getAllOrders)
// updateorder status
router.get("/orderstatus",adminAuth,updateOrderStatus)
// get all users
router.get("/allusers",adminAuth,getAllUsers)
// delete restaurant
router.delete("/deleterestaurant",adminAuth,deleteRestaurant)
// delete menuitem
router.delete("/menuitemdelete",adminAuth,deleteMenuItem)




module.exports=router