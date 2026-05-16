const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const APIFeatures = require('../utils/apiFeatures');

/**
 * @desc    Get all products with search, filter, sort, pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res, next) => {
  const resultPerPage = parseInt(req.query.limit, 10) || 12;

  // Count total matching documents (before pagination)
  const countQuery = new APIFeatures(Product.find(), req.query).search().filter();
  const totalProducts = await Product.countDocuments(countQuery.query.getFilter());

  // Get paginated results
  const features = new APIFeatures(Product.find().populate('category', 'name slug'), req.query)
    .search()
    .filter()
    .sort()
    .paginate(resultPerPage);

  const products = await features.query;

  const totalPages = Math.ceil(totalProducts / resultPerPage);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    totalPages,
    currentPage: features.page,
    products,
  });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
    });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({ success: true, product });
});

/**
 * @desc    Get top rated products
 * @route   GET /api/products/top
 * @access  Public
 */
const getTopProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await Product.find({ isActive: true })
    .sort({ ratingsAverage: -1, ratingsCount: -1 })
    .limit(limit)
    .populate('category', 'name slug');

  res.status(200).json({ success: true, products });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort('-createdAt')
    .limit(limit)
    .populate('category', 'name slug');

  res.status(200).json({ success: true, products });
});

/**
 * @desc    Get products by category slug
 * @route   GET /api/products/category/:slug
 * @access  Public
 */
const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const Category = require('../models/Category');
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  const features = new APIFeatures(
    Product.find({ category: category._id, isActive: true }).populate('category', 'name slug'),
    req.query
  )
    .filter()
    .sort()
    .paginate(12);

  const products = await features.query;
  const totalProducts = await Product.countDocuments({ category: category._id, isActive: true });

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    totalPages: Math.ceil(totalProducts / 12),
    currentPage: features.page,
    category,
    products,
  });
});

/**
 * @desc    Get related products (same category, excluding current)
 * @route   GET /api/products/:id/related
 * @access  Public
 */
const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .populate('category', 'name slug');

  res.status(200).json({ success: true, products: related });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Admin
 */
const createProduct = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Admin
 */
const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Admin
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

/**
 * @desc    Get all brands (for filter)
 * @route   GET /api/products/brands
 * @access  Public
 */
const getBrands = asyncHandler(async (req, res, next) => {
  const brands = await Product.distinct('brand', { isActive: true });
  res.status(200).json({ success: true, brands });
});

module.exports = {
  getProducts,
  getProduct,
  getTopProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
};
