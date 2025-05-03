import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import Patient from '../models/Patient.js';
import Diagnosis from '../models/Diagnosis.js';
import Prescription from '../models/Prescription.js';
import LabReport from '../models/LabReport.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

// Get patient profile
export const getPatientProfile = async (req, res) => {
  console.log(req.params.id)
  try {
    const patientId = req.params.id || req.body.user._id;
    
    const patient = await User.findOne({ _id: patientId, role: 'patient' })
      // .populate('userId', 'firstName lastName email contactNumber profileImage');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    console.log(patient)

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for doctors (by name or hospital)
export const searchDoctors = async (req, res) => {
  try {
    const { query, hospitalId } = req.query;
    let searchQuery = {};
    
    if (query) {
      // Find users who are doctors and match the name
      const users = await User.find({ 
        role: 'doctor',
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } }
        ]
      });
      
      if (users.length > 0) {
        const userIds = users.map(user => user._id);
        searchQuery.userId = { $in: userIds };
      } else {
        // No doctors found with that name
        return res.status(200).json({ doctors: [] });
      }
    }
    
    // Filter by hospital and availability if specified
    if (hospitalId) {
      searchQuery["hospitalAffiliations.hospital"] = hospitalId;
      searchQuery["hospitalAffiliations.isAvailableToday"] = true;
    }
    
    // Find doctors matching the search criteria
    const doctors = await Doctor.find(searchQuery)
      .populate('userId', 'firstName lastName email profileImage')
      .populate('hospitalAffiliations.hospital', 'name address');
    
    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient's medical history
export const getMedicalHistory = async (req, res) => {
  try {
    console.log(req.user._id)
    const patientId = req.params.id || req.user._id;
    
    // Find the patient
    const patient = await Patient.findOne({ userId: patientId });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get diagnoses
    const diagnoses = await Diagnosis.find({ patient: patient._id })
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('hospital', 'name')
      .sort({ diagnosisDate: -1 });
    
    // Get prescriptions
    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('hospital', 'name')
      .populate('diagnosis', 'diagnosisDetails condition')
      .sort({ date: -1 });
    
    // Get lab reports
    const labReports = await LabReport.find({ patient: patient._id })
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('laboratory', 'name')
      .sort({ testDate: -1 });
    
    res.status(200).json({
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

// Get list of hospitals
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.status(200).json({ hospitals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download a report (diagnosis, prescription, or lab report)
export const downloadReport = async (req, res) => {
  try {
    const { type, id } = req.params;
    let report;
    
    switch(type) {
      case 'diagnosis':
        report = await Diagnosis.findById(id)
          .populate({
            path: 'doctor',
            populate: { path: 'userId', select: 'firstName lastName' }
          })
          .populate({
            path: 'patient',
            populate: { path: 'userId', select: 'firstName lastName' }
          })
          .populate('hospital', 'name address');
        break;
      case 'prescription':
        report = await Prescription.findById(id)
          .populate({
            path: 'doctor',
            populate: { path: 'userId', select: 'firstName lastName' }
          })
          .populate({
            path: 'patient',
            populate: { path: 'userId', select: 'firstName lastName' }
          })
          .populate('hospital', 'name address')
          .populate('diagnosis', 'diagnosisDetails condition');
        break;
      case 'lab':
        report = await LabReport.findById(id)
          .populate({
            path: 'doctor',
            populate: { path: 'userId', select: 'firstName lastName' }
          })
          .populate({
            path: 'patient',
            populate: { path: 'userId', select: 'firstName lastName' }
          })
          .populate('laboratory', 'name address');
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if the logged in user has access to this report
    const patientUserId = report.patient.userId._id.toString();
    const requestUserId = req.user._id.toString();
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && userRole !== 'doctor' && patientUserId !== requestUserId) {
      return res.status(403).json({ message: 'You do not have permission to access this report' });
    }
    
    // In a real implementation, we would generate a PDF here
    // For now, just return the report data
    res.status(200).json({
      message: 'Report downloaded successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to fetch patients based on search query
export const fetchPatients = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery || '';
    const patients = await Patient.find({
      "userId.firstName": { $regex: searchQuery, $options: 'i' }
    }).select('_id userId.firstName userId.lastName'); // Select necessary fields, including _id

    res.json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};
