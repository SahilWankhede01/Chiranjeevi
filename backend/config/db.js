const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chiranjeevi-ayurveda';
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Check if the error is related to DNS / SRV resolution
    const isDnsError = error.message && (
      error.message.includes('querySrv') || 
      error.message.includes('ENOTFOUND') || 
      error.message.includes('ECONNREFUSED')
    );

    if (isDnsError) {
      console.log('Database connection failed due to DNS resolution. Retrying with custom public DNS servers...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected (via custom DNS): ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error('Database connection retry failed:');
        console.error(retryError);
      }
    }

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
