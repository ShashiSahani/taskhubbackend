const multer = require("multer");
const path = require("path");
const fs = require("fs");

// -----------------------------
// Reusable function to get storage config dynamically
// -----------------------------

const getStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${folder}/`;
      // Make sure folder exists, or create it
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },

    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

// -----------------------------
// File Filter: Accept only JPEG & PNG
// -----------------------------

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images allowed!"), false);
  }
};

// -----------------------------
// Main function
// -----------------------------

const uploadImage = (folder) =>
  multer({
    storage: getStorage(folder), // Pass folder (users or blogs)
    fileFilter: fileFilter,
    limits: { fileSize: 500 * 1024 }, // 500KB max
  });

module.exports = uploadImage;
