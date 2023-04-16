const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toISOString().replaceAll(':', '-') + '_' + file.originalname
    );
  },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, callback) => {
  callback(null, allowedTypes.includes(file.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
});
