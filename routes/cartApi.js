const express = require('express')
const router=express.Router()
const {isEmpty}=require('lodash')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const auth=require('../middleware/authorization')


router.get('/',auth,async (req,res)=>{
    try {
        const userId=req.user.id
        
        const carts=await Cart.find({userId:userId})
        if(isEmpty(carts)) return res.send({products:[]})

        let retrievedCard;
        carts.forEach(cart=>{
            if(!cart.fulfilled)retrievedCard=cart
        })

        let products=[]
        let result={}
        if(!isEmpty(retrievedCard)){
            products=retrievedCard.products.map(async (product)=>await Product.findById({_id:product}) )
            products= await Promise.all(products)
            result={...retrievedCard.toJSON(),products}
        }
        console.log(result)
        res.send({result})
    } catch (err) {
        res.status(500).json({msg:"server issue"})

    }
})
router.put('/:id',auth, async (req,res)=>{
    try {
        const cartId=req.params.cartId
        const product=req.body.product
        const cart=await Cart.update({_id:cartId},{$pullAll:{products:[product]}})
        res.send({cart})
    } catch (err) {
        res.status(500).json({msg:"server issue"})

    }
})

router.post('/', auth ,async (req,res)=>{
    try {
        const userId=req.user.id
        const {products}=req.body
        let cart
        let unfulfilledCart
        const carts=await Cart.find({userId})
        const haveValidCart=carts.reduce((acc,value)=>{
            if(!value.fulfilled){
                unfulfilledCart=value
            }
            return acc && value.fulfilled
        },true)
        if(haveValidCart){
            cart=new Cart({userId,products})
            cart=await cart.save()
        }
        else{
            const stringProduct=[
                ...unfulfilledCart.products,
                ...products
            ].map(product=>product.toString())
            const newProduct=Array.from(new Set(stringProduct))
            cart =await Cart.findByIdAndUpdate({_id:unfulfilledCart._id},{products:newProduct})

        }
        let value=cart.products.map(async (id)=>await Product.findById(id))
        value=await Promise.all(value)
        console.log(value)
        console.log(req.body)
        res.send({...cart.toJSON(),products:value})
    } catch (err) {
        res.status(500).json({msg:"server issue"})

    }
})

module.exports=router