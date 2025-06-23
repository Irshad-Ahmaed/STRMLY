const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload video (protected)
router.post('/upload', authenticate, upload.single('video'), videoController.uploadVideo);

// Public feed
router.get('/', videoController.getAllVideos);

module.exports = router;