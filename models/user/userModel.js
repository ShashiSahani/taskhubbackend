const  mongoose = require("mongoose");

const UserSchema=new mongoose.Schema({
    name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String,  },
  age: { type: Number,  },
  registrationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date,  },
  profileImage: { type: String },
});

module.exports=mongoose.model('User',UserSchema)