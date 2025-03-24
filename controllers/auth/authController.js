const User = require("../../models/user/userModel");
const fs = require('fs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {cloudinary} = require("../../config/cloudinary");
const { token } = require("morgan");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'user_images' });
      profileImage = result.secure_url;
    }

    const user = new User({ name, email, password: hashedPassword, profileImage });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age || null,                 
        expiryDate: user.expiryDate || null,   
        profileImage: user.profileImage || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      age:user.age||null,
      expiryDate: user.expiryDate || null,
      profileImage: user.profileImage ? user.profileImage : null 
    }));

    res.json({
      success: true,
      users: formattedUsers,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age:user.age||null,
        expiryDate: user.expiryDate || null,
        profileImage: user.profileImage ? user.profileImage : null
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { name, email, age, expiryDate } = req.body; // Add age and expiryDate

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age; // Update age
    if (expiryDate) user.expiryDate = expiryDate; // Update expiryDate

    if (req.file) {
      if (user.profileImage) {
        const segments = user.profileImage.split('/');
        const fileName = segments[segments.length - 1];
        const publicId = `user_images/${fileName.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'user_images' });
      user.profileImage = result.secure_url;
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age || null,
        expiryDate: user.expiryDate || null,
        profileImage: user.profileImage ? user.profileImage : null
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};






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
