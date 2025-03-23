const User = require("../../models/user/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Get uploaded image filename
    const image = req.file ? req.file.filename : null;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create user
    user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      image, // Save image filename
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({
      sucess: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllUsers=async(req,res)=>{
  try {
    const users=await User.find();
    const baseUrl=`${req.protocol}://${req.get('host')}`;

    const formattedUsers=users.map(user=>({
      id:user._id,
      name:user.name,
      email:user.email,
      image:user.image ?`${baseUrl}/uploads/user/${user.image}`:null

    }));
    res.json({
      success:true,
      users:formattedUsers,
    })
  } catch (error) {
    
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}
exports.getUserById=async(req,res)=>{
  try {
    const userId=req.params.id;
    const user=await User.findById(userId);
    if(!user) return res.status(404).json({message:"User not found"});
    const baseUrl=`${req.protocol}://${req.get('host')}`;
    res.json({
      sucess:true,
      user:{
        id:user._id,
        name: user.name,
        email: user.email,
        image: user.image
          ? `${baseUrl}/uploads/user/${user.image}`
          : null,
      },
    }); 
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Both old and new passwords are required.",
        });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Password changed successfully",
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
