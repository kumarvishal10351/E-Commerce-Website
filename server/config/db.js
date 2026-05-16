const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8', '1.1.1.1']); // Force custom DNS to fix SRV lookup on Windows

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4 to avoid NAT64/DNS64 issues
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
