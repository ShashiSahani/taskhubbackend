const Blog = require("../../models/blogs/blogModels");
const { cloudinary } = require("../../config/cloudinary");
const fs = require('fs');

//---------------------------
// Utility function
const removeTempFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.log("Failed to delete local file:", err.message);
  });
};
//---------------------------


//-------------------------------------------
// ADD BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, description, author, category, tags } = req.body;

    if (!title || !description || !author || !category || !tags || !req.file) {
      return res.status(400).json({ message: "All fields including image required" });
    }

    // Upload Image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_images",
    });

    const newBlog = new Blog({
      title,
      description,
      author,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(","),
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await newBlog.save();

    // Delete local file
    removeTempFile(req.file.path);

    res.status(201).json({ success: true, message: "Blog created", blog: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating blog", error: error.message });
  }
};

//-------------------------------------------
// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const searchQuery = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const blogs = await Blog.find(searchQuery)
      .populate("author", "name")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalBlogs = await Blog.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalBlogs / limitNumber),
      currentPage: pageNumber,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
  }
};

//-------------------------------------------
// GET BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blog", error: error.message });
  }
};

//-------------------------------------------
// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, author, category, tags } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // If new image uploaded
    if (req.file) {
      if (blog.cloudinary_id) {
        await cloudinary.uploader.destroy(blog.cloudinary_id);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });

      blog.image = result.secure_url;
      blog.cloudinary_id = result.public_id;

      removeTempFile(req.file.path);
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (author) blog.author = author;
    if (category) blog.category = category;
    if (tags) blog.tags = Array.isArray(tags) ? tags : tags.split(",");

    await blog.save();

    res.status(200).json({ success: true, message: "Blog updated", blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Delete image from Cloudinary
    if (blog.cloudinary_id) {
      await cloudinary.uploader.destroy(blog.cloudinary_id);
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
  }
};

//-------------------------------------------
// REMAINING FUNCTIONS (No Change Required)

exports.getSimilarBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    const similarBlogs = await Blog.find({
      _id: { $ne: blog._id },
      $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
    }).limit(5);

    res.status(200).json({ success: true, similarBlogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching similar blogs", error: error.message });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    if (!blog.likes.includes(req.user.id)) {
      blog.likes.push(req.user.id);
      blog.dislikes = blog.dislikes.filter((id) => id.toString() !== req.user.id);
    }

    await blog.save();
    res.status(200).json({ success: true, message: "Liked the blog!", likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error liking blog", error: error.message });
  }
};

exports.dislikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    if (!blog.dislikes.includes(req.user.id)) {
      blog.dislikes.push(req.user.id);
      blog.likes = blog.likes.filter((id) => id.toString() !== req.user.id);
    }

    await blog.save();
    res.status(200).json({ success: true, message: "Disliked the blog!", dislikes: blog.dislikes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error disliking blog", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found!" });
    }

    const { user, text } = req.body;
    if (!user || !text) {
      return res.status(400).json({ success: false, message: "User and text are required!" });
    }

    blog.comments.push({ user, text, createdAt: new Date() });

    await blog.save();
    res.status(201).json({ success: true, message: "Comment added successfully!", blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
  }
};
