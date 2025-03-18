import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema({
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
  laboratory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
    required: true
  },
  testType: {
    type: String,
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  results: {
    type: String,
    required: true
  },
  referenceRange: String,
  interpretation: String,
  reportFile: {
    fileName: String,
    fileUrl: String,
    mimeType: String
  },
  isHospitalLab: {
    type: Boolean,
    default: false
  },
  relatedDiagnosis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diagnosis'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const LabReport = mongoose.model('LabReport', labReportSchema);

export default LabReport;