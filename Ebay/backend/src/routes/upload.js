const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'img-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      // If client sent base64 image or url
      if (req.body.imageUrl) {
        return res.json({ url: req.body.imageUrl });
      }
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
