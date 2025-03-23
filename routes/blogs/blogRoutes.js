const express = require('express');
const router = express.Router();
const uploadImage =require('../../middleware/uploadMiddleware');

const blogController=require("../../controllers/blogs/blogController");


router.post("/", uploadImage('blogs').single("image"), blogController.createBlog); 
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById); 
router.put("/:id", uploadImage('blogs').single("image"), blogController.updateBlog); 
router.delete("/:id", blogController.deleteBlog);  
router.get("/:id/similar", blogController.getSimilarBlogs);
router.patch("/:id/like", blogController.likeBlog);
router.patch("/:id/dislike", blogController.dislikeBlog);
router.post("/:id/comment", blogController.addComment);
module.exports = router;