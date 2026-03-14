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
import path from 'path';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true                 // allow cookies/credentials
}));
 const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/listings", listingrouter);
app.use("/api/users",   userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});