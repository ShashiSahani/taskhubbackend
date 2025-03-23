const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `user_${Date.now()}-${file.originalname}`,
  },
});

const userUpload = multer({
  storage: userStorage,
});

module.exports = userUpload;
