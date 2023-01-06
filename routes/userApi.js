const express = require('express')
const router=express.Router()
const {check,validationResult}=require('express-validator')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const User = require('../models/User')
const { jwtSecret } = require('../config/keys')

router.get('/',(req,res)=>{
    res.send('User routes')
})

router.post('/',[
    check('name','Name is required').not().isEmpty(), 
check('email','Enter a valid email').isEmail(),
check('password','password should be atleast 5 character').isLength({min:5})
 ], async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const {name,email,password,role}=req.body
        let user=await User.findOne({email:email})
        if(user){
             console.log(user)
            return res.status(400).json({errors:[{msg:"user already exist"}]})
        }
        user=new User({name,email,password, role})
        const salt=await bcrypt.genSalt(10)
        user.password=await bcrypt.hash(password,salt)

        let savedUser=await user.save()
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
        res.status(500).send('server error')
    }
})

router.get('/',(req,res)=>{
    res.send('User routes')
})

module.exports=router;