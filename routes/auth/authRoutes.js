const express = require('express');
const {register,login, changePassword,getUserById, getAllUsers }=require('../../controllers/auth/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const uploadImage =require('../../middleware/uploadMiddleware');


const router=express.Router();


router.post('/register',  uploadImage('user').single("image"), register);
router.get('/register',  uploadImage('user').single("image"), register);
router.get('/user/:id', getUserById);
router.get('/user', getAllUsers);

router.post('/login',login);
router.post('/change-password',authMiddleware,changePassword);
module.exports = router;