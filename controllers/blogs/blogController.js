const Blog = require("../../models/blogs/blogModels");
const fs=require('fs')
const path=require('path')

const convertImageToBase64=(filePath)=>{
  try {
    const fileData=fs.readFileSync(filePath)
    return `data:image/${path.extname(filePath).slice(1)};base64,${fileData.toString("base64")}`;

    
  } catch (error) {
    throw new Error("Error converting image to base64")
  }
}
exports.createBlog = async (req, res) => {
  try {
    const { title, description, author } = req.body;
    if (!title || !description || !author || !req.file) {
      return res.status(400).json({ message: "All fields are required and image must be in Base64 format" });
    }

const imageBase64=convertImageToBase64(req.file.path)
    const newBlog = new Blog({
      title,
      description,
      author,
      image:imageBase64,
    });
    await newBlog.save();
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Blog",
      error: error.message,
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Search Query
    const searchQuery = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Fetch Blogs with Pagination & Search
    const blogs = await Blog.find(searchQuery)
    .populate("author","name")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    // Count Total Blogs
    const totalBlogs = await Blog.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalBlogs / limitNumber),
      currentPage: pageNumber,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};


exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching blog",
        error: error.message,
      });
  }
};

exports.updateBlog=async(req,res)=>{
    try {
       const {title,description,author}=req.body;
        let imageBase64;
        if(req.file){
          imageBase64=convertImageToBase64(req.file.path);
          fs.unlinkSync(req.file.path);
        }
          const updatedBlog=await Blog.findByIdAndUpdate(
            req.params.id,
            {title,description,author,...(imageBase64 &&{image:imageBase64})},
            {new:true}
        )
        if(!updatedBlog){
            return res.status(404).json({success:false,message:"Blog not found"})
        }
        return res.status(200).json({success:true,message:"Blog Updated successfully",blog: updatedBlog })

    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
    }
}
exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
};
