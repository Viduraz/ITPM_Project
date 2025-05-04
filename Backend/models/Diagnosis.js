import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: false,
  },
  diagnosisDetails: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  symptoms: [{
    type: String,
  }],
  notes: {
    type: String,
  },
  followUpDate: {
    type: Date,
  },
}, { timestamps: true });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

export default Diagnosis;
