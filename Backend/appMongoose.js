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

        // Remove legacy unique index on code to allow versioning
        try {
            await mongoose.connection.collection('curriculums').dropIndex('code_1');
            console.log('Dropped legacy unique index code_1');
        } catch (e) {
            // Index might not exist, which is fine
        }
    } catch (error) {
        console.error('MongoDB Atlas Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;