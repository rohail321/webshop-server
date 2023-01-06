const express = require('express')
const router=express.Router()
const {isEmpty}=require('lodash')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const auth=require('../middleware/authorization')
const Payment = require('../models/Payment')

const stripe=require('stripe')('sk_test_51KqDQ9LLqZKiUeIIyV0Zfp7Lz2NmfZepkzH0XpO0verJwXHTQI8EEVS30iBwqq8t16GiPanoH0kmbePPh0fQnLfq00AtYlprDz')


router.post('/',auth,async (req,res)=>{
    try {
        const {cart,total, token}=req.body
        const{card}=token
        const shippingAddress={
            adrress:card.address_line1,
            adrress2:card.address_line2,
           city:card.address_city,
           country:card.address_country,
           state:card.address_state,
           zip:card.address_zip,
        }
        stripe.charges.create({
            amount:total*100,
            currency:'usd',
            receipt_email:token.email,
            source:req.body.token.id,
            description:'Payment'
        },async (err,charge)=>{
            if(err) return res.status(400).json({err})
            if(charge && charge.status==='succeeded'){
                const authorization={
                    ...charge.paymeny_method_details,
                    reciept:charge.reciept_url,
                    token:token.id
                }
                const context={
                    authorization,
                    userId:req.user.id,
                    cartId:cart._id,
                    reference:charge.id,
                    transaction:charge.balance_transaction,
                    shippingAddress
                }
                let payment=await new Payment(context)
                payment.save()
                await Cart.findOneAndUpdate({_id:cart._id},{$set:{fulfilled:true},},{new:true})
                const theCart=await Cart.findById({_id:cart._id})
                theCart.products.forEach(async(product)=>{
                    let productDetail=await Product.findById({_id:product})
                    const qty=Number(productDetail.quantity-1)
                    await Product.findOneAndUpdate({_id:product},{$set:{quantity:qty},},{new:true})
                })
            }
        })
        res.send({status:200})

    } catch (err) {
        res.sendStatus(500)
    }
})



module.exports=router