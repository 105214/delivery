const jwt=require('jsonwebtoken')

const generateToken=(id,role="user")=>{
    try{
        var token=jwt.sign({id,role},process.env.JWT_SECRET_KEY)
       
            return token  
            
    }catch(error){
        console.log(error)
    }
}
module.exports={generateToken}