import mongoose from "mongoose";
// import config from '../config/config';

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
    }
export default connectDB;