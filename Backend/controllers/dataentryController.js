import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Hospital from '../models/Hospital.js';
import Diagnosis from '../models/Diagnosis.js';
import Prescription from '../models/Prescription.js';

// Create a Data Entry Profile
export const createDataEntryProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, profileImage, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      contactNumber,
      profileImage,
      password,
      role: 'dataentry',
    });

    await user.save();

    res.status(201).json({
      message: 'Data Entry profile created successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new diagnosis (for Data Entry Role)
export const createDiagnosisDataEntry = async (req, res) => {
  try {
    const { patientId, hospitalId, symptoms, diagnosisDetails, condition, notes, followUpDate } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const diagnosis = new Diagnosis({
      patient: patientId,
      hospital: hospitalId,
      diagnosisDate: new Date(),
      symptoms,
      diagnosisDetails,
      condition,
      notes,
      followUpDate
    });

    await diagnosis.save();

    res.status(201).json({
      message: 'Diagnosis created successfully by data entry',
      diagnosis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new prescription (for Data Entry Role)
export const createPrescriptionDataEntry = async (req, res) => {
  try {
    const { patientId, hospitalId, diagnosisId, medications, notes } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Check if diagnosis exists
    const diagnosis = await Diagnosis.findById(diagnosisId);
    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    const prescription = new Prescription({
      patient: patientId,
      hospital: hospitalId,
      diagnosis: diagnosisId,
      date: new Date(),
      medications,
      notes,
      status: 'active',
    });

    await prescription.save();

    res.status(201).json({
      message: 'Prescription created successfully by data entry',
      prescription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
