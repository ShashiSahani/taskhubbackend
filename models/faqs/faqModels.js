const { default: mongoose } = require("mongoose");

const faqSchema=new mongoose.Schema({
    question:{type:String,require:true},
    answer:{type:String,require:true},
    

},{timestamps:true});

module.exports=mongoose.model("FAQ",faqSchema);