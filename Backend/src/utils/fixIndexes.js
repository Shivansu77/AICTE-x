const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aicte_db';

const fixIndexes = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('curriculums');

        // List Indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        // Drop code_1 if it exists
        const codeIndex = indexes.find(idx => idx.name === 'code_1');
        if (codeIndex) {
            console.log('Dropping conflicting index: code_1');
            await collection.dropIndex('code_1');
            console.log('Index dropped successfully.');
        } else {
            console.log('Index code_1 not found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIndexes();
