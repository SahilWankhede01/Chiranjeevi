const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chiranjeevi-ayurveda');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('=== DATABASE CONNECTION ERROR ===');
    console.error(error);
    console.error('=================================');
    // If in production, do not exit the process immediately so the server can still run and serve the app
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
