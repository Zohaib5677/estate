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

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost', 'http://localhost:80'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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


