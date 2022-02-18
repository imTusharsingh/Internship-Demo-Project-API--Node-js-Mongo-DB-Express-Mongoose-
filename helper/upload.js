const multer = require('multer');
const path = require("path");


//defining the storage (uploads folder) for storing the images...

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//Filtering the file format (.jpg, .png, .jpeg)...
const multerFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("jpg and png file only supported!"), false);
    }
};


//saving image in uploads folder (! Image size must be less than 5mb).....
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: multerFilter
})

module.exports = upload