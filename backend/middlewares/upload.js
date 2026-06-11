const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/participants');
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes =
      /jpg|jpeg|png|webp/;

    const ext =
      allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );

    const mime =
      allowedTypes.test(file.mimetype);

    if (ext && mime) {
      return cb(null, true);
    }

    cb(new Error('Only images are allowed'));
  }
});

module.exports = upload;