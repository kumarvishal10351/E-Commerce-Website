/**
 * SECTION: Cloudinary image hosting
 * Configures the Cloudinary SDK for product/category image uploads.
 */

const cloudinary = require('cloudinary').v2;

// ─── connectCloudinary — read credentials from env ───
const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured');
};

module.exports = { cloudinary, connectCloudinary };
