const NewsLetter=require('../../models/newsletter/newsletterModels');


exports.subscribe=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"Email is Required!"});
        }

        const existingSubscriber=await NewsLetter.findOne({email});
        if(existingSubscriber){
            return res.status(400).json({message:"Email already subscribed!"});
        }

        const newSubscriber=new NewsLetter({email});
        await newSubscriber.save();
        res.status(201).json({message:"Subscribed successfully!"})
    } catch (error) {
        return res.status(500).json({message:"Internal server Error!"})
    }
}