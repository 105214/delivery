const Restaurant = require("../models/restaurantModel")
const Order = require("../models/orderModel")
const User = require("../models/userModel")
const Admin=require('../models/adminModel')
const Dish = require('../models/dishModel.js')
const bcrypt = require("bcrypt")
const {generateToken} = require("../utils/token.js")



const createAdmin=async(req,res,next)=>{
  try{
      const {name,email,password,profilePic,mobile}=req.body

      if(!name||!email||!password||!mobile){

        return res.status(400).json({ message: "All fields are required" })
      }

      const hashedPassword = bcrypt.hashSync(password, 10)

      const adminData = new Admin({
        name,
        email,
        password: hashedPassword,
        mobile,
        profilePic,
      })
      await adminData.save()

      const adminResponse = adminData.toObject()
    delete adminResponse.password;
    const token = generateToken(adminData._id)
    res.cookie("token", token)

    return res.json({ data: adminResponse, message: "New account created" })
  }catch(error)
  {
    return res.status(error.statuscode||500) .json({message:error.message||"internal server error"})
  }
}


const adminLogout=async(req,res,next)=>{


  try{
    res.clearCookie('token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict' 
    });
    return res.status(200).json({ message: 'admin Logged out successfully' });
  }catch(error){
    return res.status(500).json({ message: 'Server error', error });
  }
}


const adminLogin=async(req,res,next)=>{
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(404).json({ message: "admin not found" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = generateToken(admin._id)
    res.cookie("token", token)
    return res.json({ message: "Login successful",token})
}catch(error)
{
  res.status(500).json({ message: "Server error", error })
}
}



const adminProfile=async(req,res,next)=>{
  try{
    const {_id}=req.body
    const adminData=await Admin.findById(_id)
    delete adminData._doc.password
    return res.json({data:adminData,message:"admin profile fetched"})
  }catch(error){
     return res.status(error.statuscode||500).json({message:error.message||"internal server error"})
  }
  
}


const addRestaurant = async (req, res,next) => {
  try {
    const { name, address, mobile,ownerId,description,location } = req.body

    if (!name || !address || !mobile||!ownerId||!description||!location ) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const newRestaurant = new Restaurant({
      name,
      address,
      mobile,
      ownerId,
      description,
      location
    })

    await newRestaurant.save()
    res.status(201).json({ message: "Restaurant added successfully", newRestaurant })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}



const addMenuItem = async (req, res,next) => {
 
  try {
  
    const { restaurantId, name, description, price, category } = req.body

    if (!restaurantId || !name || !price) {
      return res.status(400).json({ message: "Restaurant ID, name, and price are required" })
    }

    const menuItem = new Dish({
      restaurantId,
      name,
      description,
      price,
      category,
    })

    await menuItem.save()
    res.status(201).json({ message: "Menu item added successfully", Dish })
  } catch (error) {
   
    res.status(500).json({ message: "Server error", error })
  }
}




const getAllOrders = async (req, res,next) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("items.dishItem", "name price");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
};


const updateOrderStatus = async (req, res,next) => {
  try {
    const { orderId, status } = req.body

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.status(200).json({ message: "Order status updated", order })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
};


const getAllUsers = async (req, res,next) => {
  try {
    const users = await User.find()
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}


const adminUpdate=async(req,res,next)=>{
  try{
    const {name,email,mobile,profilePic,_id}=req.body
    const admin=await Admin.findById({_id})

    if (!admin) {
      return res.status(404).json({ message: 'admin not found' });
    }
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (mobile)admin.mobile = mobile;
    if  (profilePic)admin.profilePic=profilePic

    await admin.save()

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        
        phone: admin.phone,
      }
  })
  }catch(error){
    res.status(500).json({ message: 'Server error', error });
  }
}


const deleteAdminProfile = async (req, res,next) => {
  try {
    
   const {_id} = req.body;
   console.log(_id)
   
    const adminProfile = await Admin.findByIdAndDelete(_id);

    res.status(200).json({ message: 'Admin profile deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteRestaurant = async (req, res,next) => {
  try {
    const { restaurantId } = req.body

    const restaurant = await Restaurant.findByIdAndDelete(restaurantId)

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    res.status(200).json({ message: "Restaurant deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}




const deleteMenuItem = async (req, res,next) => {
  try {
    const { dishId } = req.body

    const menuItem = await Dish.findByIdAndDelete(dishId)

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" })
    }

    res.status(200).json({ message: "Menu item deleted successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error })
  }
}
module.exports = {
  createAdmin,
  adminLogin,
  adminLogout,
  adminProfile,
  adminUpdate,
  deleteAdminProfile,
  addRestaurant,
  addMenuItem,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteRestaurant,
  deleteMenuItem,
}
