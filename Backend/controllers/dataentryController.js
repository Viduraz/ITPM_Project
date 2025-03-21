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

// Create a Diagnosis Entry for Data Entry Role
export const createDiagnosisDataEntry = async (req, res) => {
  try {
    const {
      patientId,
      hospitalId,
      symptoms,
      diagnosisDetails,
      condition,
      notes,
      followUpDate,
      treatmentPlanMedication,
      treatmentPlanTherapy,
      treatmentPlanLifestyle,
      treatmentPlanSurgery,
      treatmentPlanMonitoring,
      treatmentPlanDetails
    } = req.body;

    // Basic validation for required fields
    if (!patientId || !hospitalId || !symptoms || !diagnosisDetails || !condition) {
      return res.status(400).json({ message: 'Patient ID, Hospital ID, Symptoms, Diagnosis Details, and Condition are required' });
    }

    // Optional validation for follow-up date if provided
    if (followUpDate && isNaN(Date.parse(followUpDate))) {
      return res.status(400).json({ message: 'Invalid follow-up date' });
    }

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

    // Create a new diagnosis entry with the relevant fields
    const newDiagnosis = new Diagnosis({
      patient: patientId,
      hospital: hospitalId,
      symptoms,
      diagnosisDetails,
      condition,
      notes,
      followUpDate,
      treatmentPlan: {
        medication: treatmentPlanMedication,
        therapy: treatmentPlanTherapy,
        lifestyle: treatmentPlanLifestyle,
        surgery: treatmentPlanSurgery,
        monitoring: treatmentPlanMonitoring
      },
      treatmentPlanDetails
    });

    await newDiagnosis.save();

    res.status(201).json({
      message: 'Diagnosis created successfully by data entry',
      diagnosis: newDiagnosis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a Diagnosis Entry (for Doctor Role)
export const createDiagnosis = async (req, res) => {
  try {
    const { patientId, doctorId, symptoms, diagnosisDetails, treatmentPlan } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !symptoms || !diagnosisDetails || !treatmentPlan) {
      return res.status(400).json({ message: 'Patient ID, Doctor ID, Symptoms, Diagnosis Details, and Treatment Plan are required' });
    }

    // Check if the patient and doctor exist in the database
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create the diagnosis entry
    const newDiagnosis = new Diagnosis({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      diagnosisDetails,
      treatmentPlan
    });

    // Save the diagnosis entry to the database
    await newDiagnosis.save();

    // Return the saved diagnosis entry
    return res.status(201).json({ message: 'Diagnosis created successfully', diagnosis: newDiagnosis });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the diagnosis', error: error.message });
  }
};

// Create a new prescription (for Data Entry Role)
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
