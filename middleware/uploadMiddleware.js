const multer =require("multer");

const path=require("path");





const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },

    filename:function(req,file,cb){
        cb(null,file.fieldname+"-" +Date.now()+path.extname(file.originalname))
    },
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG and PNG images are allowed!"), false);
    }
};


const upload=multer({
    storage:storage,
    fileFilter:fileFilter,
    limits: { fileSize: 500 * 1024 },
})

module.exports = upload;