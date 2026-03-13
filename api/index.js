import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/user.js';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import listingrouter from './routes/listing.js';
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true                 // allow cookies/credentials
}));
app.use(express.json());
app.use(cookieParser());  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use("/api/listings", listingrouter);
app.use("/api/users",   userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);