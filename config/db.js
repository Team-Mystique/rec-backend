const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check for both MONGODB_URI and MONGO_URI for backward compatibility
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error('MongoDB connection string not found. Please set MONGODB_URI or MONGO_URI in your environment variables.');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;