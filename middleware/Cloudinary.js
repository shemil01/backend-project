const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config({ path: "./Config/.env" });


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = multer.diskStorage({});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

// Middleware to upload image to Cloudinary
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, async (error) => {
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log("result");
        req.cloudinaryImageUrl = result.secure_url;
      }
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
};

module.exports = { cloudinary, uploadImage };
