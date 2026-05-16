const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCategories, getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.route('/').get(getCategories).post(protect, authorize('admin'), createCategory);
router.get('/all', protect, authorize('admin'), getAllCategories);
router.route('/:slug').get(getCategory);
router.route('/manage/:id').put(protect, authorize('admin'), updateCategory).delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
