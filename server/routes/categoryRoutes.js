/**
 * SECTION: Category routes — mounted at /api/categories
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCategories, getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// ─── Public & admin create: root list ───
router.route('/').get(getCategories).post(protect, authorize('admin'), createCategory);

// ─── Admin: full list (/all must be before /:slug) ───
router.get('/all', protect, authorize('admin'), getAllCategories);

// ─── Public: single category by slug ───
router.route('/:slug').get(getCategory);

// ─── Admin: update/delete by ID ───
router.route('/manage/:id').put(protect, authorize('admin'), updateCategory).delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
