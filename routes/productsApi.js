const express = require('express')
const router=express.Router()
const auth=require('../middleware/authorization')
const {check,validationResult}=require('express-validator')
const Product = require('../models/Product')


router.post('/',[auth, 
    [check('name','Name is required').not().isEmpty(),
    check('description','description is required').not().isEmpty(), 
    check('category','category is required').not().isEmpty(), 
    check('price','price is required').not().isEmpty(), 
    check('quantity','quantity is required').not().isEmpty(), 
    ]],async (req,res)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})

     try {
        const {name,description,category,price,brand,quantity}=req.body
        const newProduct=new Product({
            userId:req.user.id,
            name,
            description,
            category,
            price,
            brand,
            quantity
        })
        const product=await newProduct.save()
        res.json({product})
     } catch (error) {
        console.error(error.message)
        res.status(500).json({msg:"server error"})
     }
})

router.get('/',async (req,res)=>{
    try {
        const products= await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({msg:"server error"})
    }
})

router.get('/:id',async (req,res)=>{
    try {
        const products= await Product.findById(req.params.id)
        if(!products)  return res.status(404).json({msg:"Product does not exist"})
        res.status(200).json(products)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({msg:"server error"})
    }
})

router.get("/seller/:id", auth ,async (req,res)=>{
    try {
        const products= await Product.find({userId:req.params.id})
        res.status(200).json(products)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({msg:"server error"})
    }
})
router.get("/instructors/:id", auth, async (req, res) => {
    try {
      const products = await Product.find({ userId: req.params.id });
      res.json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

module.exports=router;