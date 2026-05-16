const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Review = require('./models/Review');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');
const categoriesData = require('./data/categories.json');
const productsData = require('./data/products.json');

dotenv.config({ path: '../.env' });
if (!process.env.MONGO_URI) dotenv.config();

const seedDB = async () => {
  try {
    await connectDB();
    // Clear existing data
    await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Review.deleteMany(), Order.deleteMany(), Coupon.deleteMany()]);
    console.log('Data cleared');

    // Create admin user
    const admin = await User.create({ name: 'Admin User', email: 'admin@luxe.shop', password: 'admin123', role: 'admin' });
    // Create test user
    await User.create({ name: 'John Doe', email: 'john@luxe.shop', password: 'password123', role: 'user', addresses: [{ fullName: 'John Doe', phone: '+1234567890', addressLine1: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US', isDefault: true }] });
    console.log('Users created');

    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log('Categories created');

    // Create products with correct category references
    const products = productsData.map((p) => ({ ...p, category: categories[p.categoryIndex]._id, createdBy: admin._id }));
    products.forEach((p) => delete p.categoryIndex);
    await Product.insertMany(products);
    console.log('Products created');

    // Create sample coupons
    await Coupon.insertMany([
      { code: 'WELCOME10', discountType: 'percent', discountValue: 10, minPurchase: 50, maxDiscount: 100, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), usageLimit: 1000 },
      { code: 'SAVE20', discountType: 'fixed', discountValue: 20, minPurchase: 100, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), usageLimit: 500 },
      { code: 'MEGA50', discountType: 'percent', discountValue: 50, minPurchase: 200, maxDiscount: 500, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), usageLimit: 100 },
    ]);
    console.log('Coupons created');

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@luxe.shop / admin123');
    console.log('User login: john@luxe.shop / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

// Destroy data
if (process.argv[2] === '-d') {
  const destroyDB = async () => {
    await connectDB();
    await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Review.deleteMany(), Order.deleteMany(), Coupon.deleteMany()]);
    console.log('All data destroyed');
    process.exit(0);
  };
  destroyDB();
} else {
  seedDB();
}
