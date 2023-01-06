const mongoose=require('mongoose')
const config=require("./keys")
const db=config.mongoURI;

const connectDB=async ()=>{
    try{
        await mongoose.connect(db)
        console.log("connected to db")
    }
    catch(err){
        console.log("connection failed ",err)
        process.exit(1)

    }
}

module.exports=connectDB;