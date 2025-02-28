const express = require('express');
const router = express.Router();
const upload =require('../../middleware/uploadMiddleware');

const blogController=require("../../controllers/blogs/blogController");


router.post("/create", upload.single("image"), blogController.createBlog); 
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById); 
router.put("/:id", upload.single("image"), blogController.updateBlog); 
router.delete("/:id", blogController.deleteBlog);  

module.exports = router;