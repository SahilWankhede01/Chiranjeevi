const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  // If in production, connect to MongoDB Atlas
  if (process.env.NODE_ENV === 'production') {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('MONGO_URI environment variable is missing in production!');
      return;
    }
    
    try {
      console.log('Connecting to MongoDB Atlas (Production)...');
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected (Atlas Production): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error('=== PRODUCTION DATABASE CONNECTION ERROR ===');
      console.error(error.message);
      console.error('============================================');
      return;
    }
  }

  // In development, prefer local MongoDB, fall back to Atlas if local is not running
  const localURI = 'mongodb://127.0.0.1:27017/chiranjeevi-ayurveda';
  const atlasURI = process.env.MONGO_URI;

  try {
    console.log('Connecting to Local MongoDB (Development)...');
    const conn = await mongoose.connect(localURI);
    console.log(`MongoDB Connected (Local Development): ${conn.connection.host}`);
  } catch (localError) {
    console.warn(`Local MongoDB connection failed: ${localError.message}`);
    
    if (atlasURI) {
      console.log('Attempting connection to MongoDB Atlas (Development Fallback)...');
      try {
        const conn = await mongoose.connect(atlasURI);
        console.log(`MongoDB Connected (Atlas Development): ${conn.connection.host}`);
      } catch (atlasError) {
        // If DNS fails, try setting custom DNS servers
        const isDnsError = atlasError.message && (
          atlasError.message.includes('querySrv') || 
          atlasError.message.includes('ENOTFOUND') || 
          atlasError.message.includes('ECONNREFUSED')
        );

        if (isDnsError) {
          console.log('Atlas connection failed due to DNS. Retrying with public DNS servers...');
          try {
            dns.setServers(['8.8.8.8', '1.1.1.1']);
            const conn = await mongoose.connect(atlasURI);
            console.log(`MongoDB Connected (Atlas Development via custom DNS): ${conn.connection.host}`);
            return;
          } catch (retryError) {
            console.error('Atlas fallback connection retry failed:', retryError.message);
          }
        }
        
        console.error('=== DATABASE CONNECTION ERROR ===');
        console.error('Failed to connect to both Local MongoDB and MongoDB Atlas.');
        console.error('=================================');
        process.exit(1);
      }
    } else {
      console.error('=== DATABASE CONNECTION ERROR ===');
      console.error('Failed to connect to Local MongoDB and no MONGO_URI is configured.');
      console.error('=================================');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
