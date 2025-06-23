const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    // Create a stream from the buffer
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'strmly_videos',
        timeout: 150000, 
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error });
        }

        const newVideo = await Video.create({
          title,
          description,
          videoUrl: result.secure_url,
          userId: req.userId
        });

        res.status(201).json({ 
          message: 'Video uploaded successfully', 
          video: newVideo 
        });
      }
    );

    // Pipe the buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;       // current page number
    const limit = parseInt(req.query.limit) || 10;    // videos per page
    const skip = (page - 1) * limit;

    const total = await Video.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const videos = await Video.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      totalVideos: total,
      totalPages,
      videos
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch videos', error: err.message });
  }
};