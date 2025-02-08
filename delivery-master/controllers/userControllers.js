const User = require("../models/userModel.js");
// const cloudinary=require('../config/cloudinary.js')
const bcrypt = require("bcrypt")
const {generateToken} = require("../utils/token.js")
const Order = require("../models/orderModel.js")
const multer=require("../middleware/multer.js");
const { cloudinaryInstance } = require("../config/cloudinary.js");


const userSignup = async (req, res, next) => {
  try {
    const { name, email, password, mobile,profilePic } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    
   
    let imageUrl

    if (req.file) {
      
        const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        
        console.log("Cloudinary Response ===", cloudinaryResponse);
        imageUrl = cloudinaryResponse.secure_url;
    
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    console.log("imageurl",imageUrl)

    const userData = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilePic:imageUrl, //imageUrl, // Use the uploaded image URL or default image
    });

    await userData.save();

    const userResponse = userData.toObject();
    delete userResponse.password;

    const token = generateToken(userData._id);
    res.cookie("token", token);

    return res.json({ data: userResponse, message: "New account created" });
  } catch (error) {
    console.log(error,"error");
    
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};


// const userSignup = async (req, res, next) => {
//   try {
//     const { name, email, password, mobile, image } = req.body
 
    
//     if (!name || !email || !password || !mobile) {
//       return res.status(400).json({ message: "All fields are required" })
//     }
//      console.log("image===",req.file)
//      let cloudinaryResponse = { url: "" }

//      if (req.file && req.file.path) {
//       cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
//     }
//   //    if (req.file) {
//   //     cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
//   // }

//   console.log("cldRes====", cloudinaryResponse);

//     const isUserExist = await User.findOne({ email })

//     if (isUserExist) {
//       return res.status(400).json({ message: "User already exists" })
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10)

//     const userData = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobile,
//       image: cloudinaryResponse.secure_url,
//     })
//     await userData.save()
   
//     const userResponse = userData.toObject()
//     delete userResponse.password;
//     const token = generateToken(userData._id)
//     res.cookie("token", token)

//     return res.json({ data: userResponse, message: "New account created" })
//   } catch (error) {
//     return res.status(error.statusCode || 500).json({
//       message: error.message || "Internal server error",
//     })
//   }
// }

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)
    res.cookie("token", token)

    return res.json({ message: "Login successful","token":token})
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}




 
const getProfile=async(req,res,next)=>{
  try{
    const {_id}=req.body
    const userData=await User.findById(_id)
    delete userData._doc.password
    return res.json({data:userData,message:"user profile fetched"})
  }catch(error){
     return res.status(error.statuscode||500).json({message:error.message||"internal server error"})
  }
  }
// }

const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile,_id } = req.body;

    const user = await User.findById({_id});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile)user.mobile = mobile;
    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   user.password = hashedPassword;
    // }
    // if (profilePic) user.profilePic = profilePic;
    await user.save();
    // user.password = undefined

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}




// const getOrderHistory = async (req, res, next) => {
//   try {
//     const userId=req.body
//     const orders = await Order.find({userId})
//     //  userId: req.userId
//     res.status(200).json({ orders });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error })
//   }
// }

// Backend (Express) logout function
const userLogout = (req, res) => {
  try {
   
    res.clearCookie('token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict' 
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}



const deleteUserProfile = async (req, res) => {
  try {
    
   const {_id} = req.body;
   console.log(_id)
    // Find and delete the user by userId
    const userProfile = await User.findByIdAndDelete(_id);

    // if (!userProfile) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    // Send a response confirming the deletion
    res.status(200).json({ message: 'User profile deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
  userSignup,
  userLogin,
  userLogout,
  getProfile,
  updateProfile,
  deleteUserProfile,
}

































