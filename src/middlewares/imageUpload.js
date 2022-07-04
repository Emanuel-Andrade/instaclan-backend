const multer = require('multer');
const path = require('path');

// Profile Picture
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads/users/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Math.random() + path.extname(file.originalname));
  },
});

const profileImageUpload = multer({
  storage: profileImageStorage,
  fileFilter(req, file, cb) {
    return cb(null, true);
  },
});

// Others Pictures
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads/photos/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Math.random() + path.extname(file.originalname));
  },
});

const imagesUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    return cb(null, true);
  },
});
module.exports = { imagesUpload, profileImageUpload };
