const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validate');
const { getProducts, getProduct, getTopProducts, getFeaturedProducts, getProductsByCategory, getRelatedProducts, createProduct, updateProduct, deleteProduct, getBrands } = require('../controllers/productController');

router.get('/top', getTopProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/category/:slug', getProductsByCategory);
router.get('/:id/related', getRelatedProducts);
router.route('/').get(getProducts).post(protect, authorize('admin'), validateProduct, createProduct);
router.route('/:id').get(getProduct).put(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
