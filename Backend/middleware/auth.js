import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Update the .env file to include JWT_SECRET
// JWT_SECRET=your_jwt_secret_key

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};