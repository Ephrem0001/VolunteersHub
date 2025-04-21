const multer = require('multer');
const path = require('path');

// Set up storage for the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store uploaded files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Give the file a unique name
  },
});

// Initialize the multer upload middleware
const upload = multer({ storage });

module.exports = upload;
