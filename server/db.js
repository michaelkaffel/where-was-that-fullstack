import mongoose from 'mongoose';

let connectionPromise = null;

export const connectDB = async () => {
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });

        try {
            await connectionPromise;
            console.log('Connected correctly to server');
            console.log(`MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
        } catch (err) {
            console.error('MongoDB connection error:', err);
            connectionPromise = null;
            throw err;
        }

        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });
    }
    return connectionPromise;
}
