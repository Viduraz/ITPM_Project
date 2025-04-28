import DataEntry from '../models/DataEntry.js';
import User from '../models/User.js';
import Diagnosis from '../models/Diagnosis.js';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';

// Create data entry profile
export const createDataEntryProfile = async (req, res) => {
  try {
    const { userId, workShift, supervisor, department } = req.body;

    // Check if profile already exists
    const existingProfile = await DataEntry.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Data entry profile already exists for this user' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set user role to dataentry if it's not already
    if (user.role !== 'dataentry') {
      user.role = 'dataentry';
      await user.save();
    }

    // Create new data entry profile
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

// Get data entry profile
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

//create diagnosis
export const createDiagnosis = async (req, res) => {
  try {
    const { patientId, hospitalId, symptoms, diagnosisDetails, condition, notes, followUpDate } = req.body;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const diagnosis = new Diagnosis({
      patient: patientId,
      doctor: doctor._id,
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
      message: 'Diagnosis created successfully',
      diagnosis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      hospital,
      diagnosis,
      date,
      medications,
      notes,
      status,
      purchasedFrom,
      pharmacyDetails,
    } = req.body;

    // Basic validation (you can expand this)
    if (!patient || !doctor || !diagnosis || !medications || medications.length === 0) {
      return res.status(400).json({ message: 'Patient, Doctor, Diagnosis, and at least one medication are required.' });
    }

    // Create the prescription
    const newPrescription = new Prescription({
      patient,
      doctor,
      hospital,
      diagnosis,
      date: date || new Date(), // fallback if not provided
      medications,
      notes,
      status,
      purchasedFrom,
      pharmacyDetails,
    });

    // Save to database
    const savedPrescription = await newPrescription.save();

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: savedPrescription,
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Server error while creating prescription' });
  }
};

// Fetch all prescriptions (this can be extended to filter by patient, doctor, etc.)
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find(); // Fetch all prescriptions
    res.status(200).json(prescriptions); // Return them as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
};

// Get tasks assigned to data entry operator
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

// Controller to get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('patientId name');
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};
