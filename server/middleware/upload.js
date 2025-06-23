const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') cb(null, true);
  else cb(new Error('Only MP4 files allowed'), false);
};

// memory storage
const upload = multer({
  storage: multer.memoryStorage(), // File stays in memory as Buffer
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // Limit to 100MB
  }
});

module.exports = upload;