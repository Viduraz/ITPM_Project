import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
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
  diagnosis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diagnosis',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  purchasedFrom: {
    type: String,
    enum: ['hospital_pharmacy', 'outside_pharmacy', 'not_purchased'],
    default: 'not_purchased'
  },
  pharmacyDetails: {
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      // Custom validation for conditional requirement based on purchasedFrom
      validate: {
        validator: function(value) {
          // If "purchasedFrom" is "not_purchased", "pharmacyId" should not be required
          if (this.purchasedFrom === 'not_purchased') {
            return true; // No validation needed for pharmacyId when not purchased
          }
          // Otherwise, validate that pharmacyId is provided
          return value != null;
        },
        message: 'Pharmacy ID is required when purchasedFrom is not "not_purchased"'
      }
    },
    purchaseDate: Date,
    invoiceNumber: String
  }
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
