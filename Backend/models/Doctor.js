import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  hospitalAffiliations: [{
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    isAvailableToday: {
      type: Boolean,
      default: false
    }
  }],
  experience: {
    type: Number,  // In years
    default: 0
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }]
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;