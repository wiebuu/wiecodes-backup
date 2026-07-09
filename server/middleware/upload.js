const multer = require('multer');
const path = require('path'); // ✅ Make sure you import 'path'

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Multer instance for multiple fields
const upload = multer({ storage });

module.exports = upload.fields([
  { name: 'zipFile', maxCount: 1 },
  { name: 'previewImage', maxCount: 1 }
]);
