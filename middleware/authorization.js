const jwt=require("jsonwebtoken")
const {jwtSecret}=require('../config/keys')

module.exports=function (req,res,next) {
    const token=req.header("x-auth-token")

    if(!token){
        return res.status(401).json({msg:"not authorized"})
    }
    try {
        const decoded=jwt.verify(token,jwtSecret)
        req.user=decoded.user
        next()
    } catch (error) {
        res.status(401).json({msg:"invalid token"})
    }
}