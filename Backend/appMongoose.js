const mongoose = require('mongoose');

// MongoDB Atlas connection string - must be provided via environment variable
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is required');
    process.exit(1);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log('MongoDB Atlas Connected Successfully');
    } catch (error) {
        console.error('MongoDB Atlas Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports =  connectDB;