import mongoose from 'mongoose';
import DataEntry from '../models/DataEntry.js';
import User from '../models/User.js';
import Diagnosis from '../models/Diagnosis.js';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';

export const createDataEntryProfile = async (req, res) => {
  try {
    const { userId, workShift, supervisor, department } = req.body;

    // Check if the data entry profile already exists
    const existingProfile = await DataEntry.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Data entry profile already exists for this user' });
    }

    // Get the user document
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user role if needed
    if (user.role !== 'dataentry') {
      user.role = 'dataentry';
      await user.save();
    }

    // Create the data entry profile
    const dataEntry = new DataEntry({
      userId,
      workShift: workShift || 'Morning',
      supervisor: supervisor || null,
      department: department || 'General',
      assignedTasks: []
    });

    await dataEntry.save();

    res.status(201).json({
      message: 'Data entry profile created successfully',
      dataEntry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*******  5c285ee7-98e9-4459-ad3a-19692bbf74a5  *******/

// ─────────────────────────────────────────────
// Get Data Entry Profile
export const getDataEntryProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const dataEntry = await DataEntry.findOne({ userId })
      .populate('userId', 'firstName lastName email contactNumber')
      .populate('supervisor', 'firstName lastName');

    if (!dataEntry) {
      return res.status(404).json({ message: 'Data entry profile not found' });
    }

    res.status(200).json({ dataEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get Assigned Tasks
export const getAssignedTasks = async (req, res) => {
  try {
    const dataEntry = await DataEntry.findOne({ userId: req.user._id })
      .populate('assignedTasks.assignedBy', 'firstName lastName');

    if (!dataEntry) {
      return res.status(404).json({ message: 'Data entry profile not found' });
    }

    res.status(200).json({ tasks: dataEntry.assignedTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Diagnosis Handlers
export const createDiagnosis = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      hospitalId,
      condition,
      diagnosisDetails,
      symptoms,
      notes,
      followUpDate
    } = req.body;

    // Validate if the provided IDs are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid Patient ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid Doctor ID' });
    }
    if (hospitalId && !mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ message: 'Invalid Hospital ID' });
    }

    // Proceed with creating the diagnosis
    const diagnosis = new Diagnosis({
      patientId,
      doctorId,
      hospitalId,
      condition,
      diagnosisDetails,
      symptoms: symptoms.split(',').map(s => s.trim()),
      notes,
      followUpDate
    });

    await diagnosis.save();

    res.status(201).json({
      message: 'Diagnosis created successfully',
      diagnosis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all diagnoses
export const getAllDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find()
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId', // Populate 'userId' from the Patient model
          model: 'User'
        }
      })
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId', // Populate 'userId' from the Doctor model
          model: 'User'
        }
      })
      .populate('hospitalId'); // Populating hospitalId if required

    res.status(200).json(diagnoses);
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
    res.status(500).json({ message: 'Failed to retrieve diagnoses.' });
  }
};

export const getDiagnosisById = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id).populate('patientId doctorId');
    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }
    res.status(200).json(diagnosis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiagnosis = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      hospitalId,
      condition,
      diagnosisDetails,
      symptoms,
      notes,
      followUpDate
    } = req.body;

    const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
      req.params.id,
      {
        patientId,
        doctorId,
        hospitalId,
        condition,
        diagnosisDetails,
        symptoms: symptoms.split(',').map(s => s.trim()),
        notes,
        followUpDate
      },
      { new: true }
    );

    if (!updatedDiagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.status(200).json({
      message: 'Diagnosis updated successfully',
      diagnosis: updatedDiagnosis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiagnosis = async (req, res) => {
  try {
    const deleted = await Diagnosis.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.status(200).json({ message: 'Diagnosis deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Prescription Handlers (ESM Style)
export const createPrescription = async (req, res) => {
  try {
    const { diagnosis, pharmacyDetails, purchasedFrom, medications, date } = req.body;

    // 1. Validate Diagnosis ID
    if (!mongoose.Types.ObjectId.isValid(diagnosis)) {
      return res.status(400).json({ message: 'Invalid diagnosis ID' });
    }

    // 2. Validate required fields
    if (!medications || medications.length === 0) {
      return res.status(400).json({ message: 'At least one medication is required' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // 3. Conditionally validate Pharmacy ID
    if (purchasedFrom !== 'not_purchased') {
      if (!pharmacyDetails || !mongoose.Types.ObjectId.isValid(pharmacyDetails.pharmacyId)) {
        return res.status(400).json({ message: 'Pharmacy ID is required when purchased' });
      }
    } else {
      // Clean up pharmacyDetails if not purchased
      delete req.body.pharmacyDetails;
    }

    // 4. Create and save prescription
    const newPrescription = new Prescription(req.body);
    await newPrescription.save();

    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create prescription',
      error: error.message,
    });
  }
};

//get prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate('diagnosis');
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};


export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const updated = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update prescription', error: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const deleted = await Prescription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.status(200).json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete prescription', error: error.message });
  }
};

// ─────────────────────────────────────────────
// Optional: Placeholder for patient listing
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
};
