const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
     ownerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Owner",  
          required: true,
        },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    menu: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        available: {
          type: Boolean,
          default: true,
        },
      },
    ],
    imageUrl: {
      type: String,
    },
    mobile:{
       type:String,
       required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    workingHours: {
      type: Map,
      of: String,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 5, 
    },
  },
  { timestamps: true } 
);


const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
