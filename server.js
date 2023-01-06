const express=require('express')
const app=express()
const connectDB=require("./config/db")
const morgan=require("morgan")
const cors=require("cors")
require('dotenv').config()
const PORT=process.env.PORT||5000;

app.use(cors())
app.use(morgan('dev'))

connectDB()

app.use(express.json({extended:false}))
app.use('/api/users', require('./routes/userApi'))
app.use('/api/products', require('./routes/productsApi'))
app.use('/api/auth', require('./routes/authApi'))
app.use('/api/profile', require('./routes/profileApi'))
app.use('/api/cart', require('./routes/cartApi'))
app.use('/api/payment',require('./routes/paymentApi'))





app.get('/',(req,res)=>{
    res.send('My app working')
})

app.listen(PORT, ()=>{
    console.log(`server is listening at port ${PORT}`)
})