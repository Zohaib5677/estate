import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/estate";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    console.error("Check that MongoDB is running locally or update MONGO_URI in api/.env with a valid Atlas connection string.");
    process.exit(1);
  }
};

export default connectDB;
