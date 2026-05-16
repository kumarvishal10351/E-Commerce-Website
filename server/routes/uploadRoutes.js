const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
}});

router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);
router.post('/images', protect, authorize('admin'), upload.array('images', 10), uploadImages);
router.delete('/image', protect, authorize('admin'), deleteImage);

module.exports = router;
