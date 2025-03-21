const mongoose=require("mongoose");


const NewsletterSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
},},{timestamps:true});



module.exports=mongoose.model("Newsletter",NewsletterSchema)