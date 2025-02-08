const mongoose=require('mongoose')



const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,  
      trim: true,   
    },
    description: {
      type: String,
      trim: true,  
    },
    price: {
      type: Number,
      min: 0,  
    },
    category: {
      type: String,
      enum: ["starter", "main course", "dessert", "beverage"], // Restrict category to predefined options
    },
    imageUrl: {
      type: String,
      default: "",  
    },
    availability: {
      type: Boolean,
      default: true,   
    },
    ingredients: {
      type: [String],  
      
    },
    ratings: {
      type: [Number],  
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }  
);




const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
