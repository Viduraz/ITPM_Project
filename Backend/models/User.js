import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  IdNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient', 'pharmacy', 'laboratory','dataentry'],
    default: 'patient'
  },
  profileImage: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  // Simple password hashing (in a real app, use bcrypt)
  this.password = crypto.createHash('sha256').update(this.password).digest('hex');
  next();
});

const User = mongoose.model('User', userSchema);

export default User;