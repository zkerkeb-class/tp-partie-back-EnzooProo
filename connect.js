import mongoose from "mongoose";

console.log("Attempting to connect to MongoDB...");

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://172.20.64.1:27017/pokemon-db-2");
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};


connectDB();