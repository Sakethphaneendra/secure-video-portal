const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Upload Video
router.post('/upload', async (req, res) => {
  const { title, description, level, url } = req.body;
  try {
    const video = new Video({ title, description, level, url });
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get Videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = router;