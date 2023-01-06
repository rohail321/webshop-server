const mongoose=require('mongoose')
const profileSchema=new mongoose.Schema ({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
       },
       website:{
        type:String
       },
       address:{
        type:String,
        required:true
       },
       bio:{
        type:String,
        required:true
       },
       socialMedia:{
        facebook:{
            type:String
        },
        twitter:{
            type:String
        },
        instagram:{
            type:String
        },
        youtube:{
            type:String
        },
        linkedin:{
            type:String
        },
       }
})

const Profile=mongoose.model("Profile", profileSchema);
module.exports=Profile