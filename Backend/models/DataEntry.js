import mongoose from 'mongoose';

const dataEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Refers to the User model, linking to the user
    required: true,
  },
  assignedTasks: [{
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  }],
  workShift: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Night'],
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Refers to the supervisor (could be an admin, manager, etc.)
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  performanceRating: {
    type: Number,  // Rating for the data entry work, e.g., 1 to 5
    min: 1,
    max: 5,
    default: 3,
  },
}, { timestamps: true });

const DataEntry = mongoose.model('DataEntry', dataEntrySchema);

export default DataEntry;
