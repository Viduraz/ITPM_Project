import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  diagnosisDate: {
    type: Date,
    default: Date.now
  },
  symptoms: [{
    type: String
  }],
  diagnosisDetails: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  notes: String,
  followUpDate: Date
}, { timestamps: true });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

export default Diagnosis;