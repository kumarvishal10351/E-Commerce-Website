/**
 * SECTION: Upload routes (admin) — mounted at /api/upload
 * Images go to Cloudinary via multer memory storage.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');

// ─── Multer: accept images in memory (max 5MB) ───
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
}});

// ─── Admin: single, batch upload, delete ───
router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);
router.post('/images', protect, authorize('admin'), upload.array('images', 10), uploadImages);
router.delete('/image', protect, authorize('admin'), deleteImage);

module.exports = router;
