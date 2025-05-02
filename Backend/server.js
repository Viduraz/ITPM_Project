import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import dataentryRoutes from './routes/dataentryRoutes.js';
import posRoutes from './routes/posRoutes.js';
import { checkMySQLConnection } from './models/MySqlDB.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();
checkMySQLConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/laboratory', laboratoryRoutes);
app.use('/api/dataentry', dataentryRoutes);
app.use('/api/pos', posRoutes);

// Simple test route
app.get('/api', (req, res) => {
  res.json({ message: 'Medical History Management System API is running' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});