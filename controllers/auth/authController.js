const User = require("../../models/user/userModel");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });
  user = new User({ name, email, password: bcrypt.hashSync(password, 10) });
  await user.save();
  res.json({ token: jwt.sign({ id: user.id }, process.env.JWT_SECRET) });
};

exports.login = async (req, res) => {
 try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(400).json({ message: "Invalid credentials" });
    const token =jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    res.json({sucess:true,message:"Login successful",token,user:{
        _id:user._id,
        name:user.name,
        email:user.email
    }});
 } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
 }
};
