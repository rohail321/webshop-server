const express = require('express')
const router=express.Router()
const {check,validationResult}=require('express-validator')

const auth=require('../middleware/authorization')


const { jwtSecret } = require('../config/keys')
const Profile = require('../models/Profile')
const Product = require('../models/Product')
const User = require('../models/User')

router.get('/:id',async(req,res)=>{
    try {
        const profile=await Profile.findOne({userId:req.params.id})
        if(!profile){
            return res.status(400).json({profile:{socialMedia:{}}})
        }
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"server issue"})
    }
})

router.post("/",auth,[auth, 
    [check('address','Address is required').not().isEmpty(),
    check('bio','Bio is required').not().isEmpty(), 
    ]], async (req,res)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})
        const {website,address,bio,facebook, instagram, twitter, youtube,linkedin}=req.body
        const ProfileData={

        }
        ProfileData.userId=req.user.id
        if(website) ProfileData.website=website
        if(address) ProfileData.address=address
        if(bio) ProfileData.bio=bio
        if(website) ProfileData.website=website
        ProfileData.socialMedia={}
        if(facebook) ProfileData.socialMedia.facebook=facebook
        if(instagram) ProfileData.socialMedia.instagram=instagram
        if(twitter) ProfileData.socialMedia.twitter=twitter
        if(youtube) ProfileData.socialMedia.youtube=youtube
        if(linkedin) ProfileData.socialMedia.linkedin=linkedin
        try {
            let profile=await Profile.findOne({userId:req.user.id})
            if(profile){
                profile=await Profile.findOneAndUpdate({userId:req.user.id},{$set:ProfileData},{new:true})
                return res.status(200).json(profile)
            }
            profile=new Profile(ProfileData)
            await profile.save()
            res.json(profile)
        } catch (error) {
            console.log(err.message)
            res.status(500).json({msg:"server issue"})
        }




    })
    router.delete('/',auth,async(req,res)=>{
        try {
           await Product.findByIdAndRemove({userId:req.user.id})
           await Profile.findOneAndRemove({userId:req.user.id})
           await User.findOneAndRemove({_id:req.user.id})
           res.json({smg:'User deleted'})
        } catch (err) {
            res.status(500).json({msg:"server issue"})
        }
    })
module.exports=router