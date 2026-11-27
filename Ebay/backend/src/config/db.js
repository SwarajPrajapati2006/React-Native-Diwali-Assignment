const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://Swaraj69:kundan2006@backend.rwe3tsb.mongodb.net/campusmarket?retryWrites=true&w=majority&appName=backend';
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    // Don't kill process immediately to allow dev/mock fallback if needed
  }
};

module.exports = connectDB;
