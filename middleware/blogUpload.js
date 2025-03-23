const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `blog_${Date.now()}-${file.originalname}`,
  },
});

const blogUpload = multer({
  storage: blogStorage,
});

module.exports = blogUpload;
