const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY
});

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_images', 
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images', 
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});


module.exports = { cloudinary, userStorage,blogStorage };
