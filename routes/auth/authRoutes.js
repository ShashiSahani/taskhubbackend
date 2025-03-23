const express = require('express');
const {register,login, changePassword,getUserById, getAllUsers }=require('../../controllers/auth/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const uploadImage =require('../../middleware/uploadMiddleware');
const upload = require('../../middleware/multer');


const router=express.Router();


router.post('/register', upload.single('profileImage'), register);

router.get('/register', upload.single('profileImage'), register);
router.get('/user/:id', getUserById);
router.get('/user', getAllUsers);

router.post('/login',login);
router.post('/change-password',authMiddleware,changePassword);
module.exports = router;