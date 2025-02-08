const jwt=require('jsonwebtoken')

const ownerAuth=(req,res,next)=>{
    try{
        const {token}=req.cookies
        console.log("tokkeen",token)
        if(!token){
            return res.status(401).json({message:"owner not authorized",success:false})
        }
        const tokenVerified=jwt.verify(token,process.env.JWT_SECRET_KEY)

        if(!tokenVerified){
            return res.status(401).json({message:"owner not authorized",success:false})
        }
        req.owner=tokenVerified
        next()
    }catch(error){
        return res.status(401).json({message:error.message||"user autherization failed",success:false})
    }
}
module.exports=ownerAuth





















