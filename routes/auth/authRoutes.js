const express = require('express');
const {register,login, changePassword,getUserById, getAllUsers, updateUser }=require('../../controllers/auth/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const userUpload = require('../../middleware/userUpload');


const router=express.Router();


router.post('/register', userUpload.single('profileImage'), register);
router.put('/user/:id', userUpload.single('profileImage'), updateUser);
router.get('/register', userUpload.single('profileImage'), register);
router.get('/user/:id', getUserById);
router.get('/user', getAllUsers);

router.post('/login',login);
router.post('/change-password',authMiddleware,changePassword);
module.exports = router;