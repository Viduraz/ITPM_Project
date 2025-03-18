import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import Patient from '../models/Patient.js';
import Diagnosis from '../models/Diagnosis.js';
import Prescription from '../models/Prescription.js';
import LabReport from '../models/LabReport.js';

// Get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user._id;
    
    const doctor = await Doctor.findOne({ userId: doctorId })
      .populate('userId', 'firstName lastName email contactNumber profileImage')
      .populate('hospitalAffiliations.hospital', 'name address contactNumber');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update doctor availability
export const updateAvailability = async (req, res) => {
  try {
    const { hospitalId, isAvailable } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Find the hospital in doctor's affiliations
    const hospitalIndex = doctor.hospitalAffiliations.findIndex(
      affiliation => affiliation.hospital.toString() === hospitalId
    );

    if (hospitalIndex === -1) {
      // If hospital not found in affiliations, add it
      doctor.hospitalAffiliations.push({
        hospital: hospitalId,
        isAvailableToday: isAvailable
      });
    } else {
      // Update availability for existing hospital
      doctor.hospitalAffiliations[hospitalIndex].isAvailableToday = isAvailable;
    }

    await doctor.save();

    res.status(200).json({ 
      message: `Availability for hospital updated successfully to ${isAvailable ? 'available' : 'not available'}`,
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search patient
export const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Find users that match the search query (first name, last name)
    const users = await User.find({ 
      role: 'patient',
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    });

    const userIds = users.map(user => user._id);
    
    // Find patients with matching user IDs
    const patients = await Patient.find({ userId: { $in: userIds } })
      .populate('userId', 'firstName lastName email contactNumber profileImage');

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient medical history
export const getPatientMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const patient = await Patient.findById(patientId)
      .populate('userId', 'firstName lastName email contactNumber');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get diagnoses
    const diagnoses = await Diagnosis.find({ patient: patientId })
      .populate('doctor', 'userId')
      .populate('hospital', 'name')
      .sort({ diagnosisDate: -1 });
    
    // Get prescriptions
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'userId')
      .populate('hospital', 'name')
      .populate('diagnosis')
      .sort({ date: -1 });
    
    // Get lab reports
    const labReports = await LabReport.find({ patient: patientId })
      .populate('doctor', 'userId')
      .populate('laboratory', 'name')
      .sort({ testDate: -1 });
    
    res.status(200).json({
      patient,
      medicalHistory: {
        diagnoses,
        prescriptions,
        labReports
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new diagnosis
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

// Create new prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, hospitalId, diagnosisId, medications, notes } = req.body;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescription = new Prescription({
      patient: patientId,
      doctor: doctor._id,
      hospital: hospitalId,
      diagnosis: diagnosisId,
      date: new Date(),
      medications,
      notes,
      status: 'active',
    });

    await prescription.save();

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json({ hospitals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};