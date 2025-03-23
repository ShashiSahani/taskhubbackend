const express = require('express');
const router = express.Router();

const blogController=require("../../controllers/blogs/blogController");
const blogUpload = require('../../middleware/blogUpload');


router.post("/", blogUpload.single("image"), blogController.createBlog); 
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById); 
router.put("/:id", blogUpload.single("image"), blogController.updateBlog); 
router.delete("/:id", blogController.deleteBlog);  
router.get("/:id/similar", blogController.getSimilarBlogs);
router.patch("/:id/like", blogController.likeBlog);
router.patch("/:id/dislike", blogController.dislikeBlog);
router.post("/:id/comment", blogController.addComment);
module.exports = router;