const express = require('express');
const auth = require('../middleware/authorization');
const { jwtSecret } = require('../config/keys')

const User = require('../models/User');
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {check,validationResult}=require('express-validator')


const router=express.Router()

router.get('/', auth ,async (req,res)=>{
   try {
        console.log(req.user)
        const user=await User.findById(req.user.id).select("-password")
        console.log(user)
        res.json(user)
   } catch (error) {
    console.log(error)
   }
})

router.post('/',[
check('email','Enter a valid email').isEmail(),
check('password','enter password').exists()
 ], async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const {email,password}=req.body
        let user=await User.findOne({email})
        if(!user) return res.status(400).json({errors:[{msg:"user does not exist"}]})
        
        const match= await bcrypt.compare(password,user.password)
        if(!match) return res.status(400).json({errors:[{msg:"incorrect password"}]})
       
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,jwtSecret,{expiresIn:3600*24},(err,token)=>{
            if(err) throw err
            res.json({token})
        })
        // res.status(200).json({savedUser:savedUser})
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
})

module.exports=router;