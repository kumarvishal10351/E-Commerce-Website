const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ parent: null, isActive: true }).populate('subcategories');
  res.status(200).json({ success: true, categories });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate('subcategories').sort('name');
  res.status(200).json({ success: true, categories });
});

const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('subcategories');
  if (!category) return next(new ErrorResponse('Category not found', 404));
  res.status(200).json({ success: true, category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorResponse('Category not found', 404));
  if (req.body.name) {
    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorResponse('Category not found', 404));
  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, getAllCategories, getCategory, createCategory, updateCategory, deleteCategory };
