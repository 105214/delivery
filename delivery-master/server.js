
const express=require('express')
const mongoose=require('mongoose')
const cors=require("cors")
const cookieParser = require('cookie-parser');
const dotenv=require("dotenv")
const apiRouter=require('./router/index.js')
dotenv.config("./.env")
const app=express()
const port=3001
const dbpassword=process.env.DB_PASSWORD


mongoose.connect(`mongodb+srv://food_app:foodapp@cluser1.qd3yu.mongodb.net/?retryWrites=true&w=majority&appName=Cluser1`)
.then(res=>{
 console.log("database connected")
})
.catch(err=>{
    console.log("database connection failed")
})
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","PUT","POST","DELETE","OPTIONS"],
    credentials:true,
}))
app.use(cookieParser());
app.use('/api',apiRouter)



app.listen(port,()=>{
    console.log("port running")
})