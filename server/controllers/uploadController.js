const { cloudinary } = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new ErrorResponse('Please upload a file', 400));
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, { folder: 'luxe-commerce', resource_type: 'image' });
  res.status(200).json({ success: true, image: { public_id: result.public_id, url: result.secure_url } });
});

const uploadImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next(new ErrorResponse('Please upload files', 400));
  const images = [];
  for (const file of req.files) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'luxe-commerce', resource_type: 'image' });
    images.push({ public_id: result.public_id, url: result.secure_url });
  }
  res.status(200).json({ success: true, images });
});

const deleteImage = asyncHandler(async (req, res, next) => {
  const { public_id } = req.body;
  if (!public_id) return next(new ErrorResponse('Please provide image public_id', 400));
  await cloudinary.uploader.destroy(public_id);
  res.status(200).json({ success: true, message: 'Image deleted' });
});

module.exports = { uploadImage, uploadImages, deleteImage };
