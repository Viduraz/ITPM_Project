import mongoose from 'mongoose';

const dataEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workShift: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Night'],
    default: 'Morning'
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  department: {
    type: String,
    default: 'General'
  },
  assignedTasks: [{
    taskType: {
      type: String,
      enum: ['Diagnosis Entry', 'Prescription Entry', 'Lab Report Entry'],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  }]
}, { timestamps: true });

const DataEntry = mongoose.model('DataEntry', dataEntrySchema);

export default DataEntry;