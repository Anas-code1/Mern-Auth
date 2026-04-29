import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('database connected'));
        
        // This will now throw an error if it fails
        await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
    } catch (error) {
        console.error("CRITICAL ERROR: Could not connect to MongoDB:", error);
    }
}

export default connectDB;