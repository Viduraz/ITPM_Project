import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [{
    type: String
  }],
  medicalHistory: [{
    condition: String,
    diagnosedAt: Date,
    notes: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    contactNumber: String
  }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;