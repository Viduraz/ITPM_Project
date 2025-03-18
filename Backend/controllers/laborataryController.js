import Laboratory from '../models/Laboratory.js';
import User from '../models/User.js';
import LabReport from '../models/LabReport.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

// Get laboratory profile
export const getLaboratoryProfile = async (req, res) => {
  try {
    const laboratoryId = req.params.id || req.user._id;
    
    const laboratory = await Laboratory.findOne({ userId: laboratoryId })
      .populate('userId', 'firstName lastName email contactNumber profileImage')
      .populate('hospital', 'name address');
    
    if (!laboratory) {
      return res.status(404).json({ message: 'Laboratory profile not found' });
    }

    res.status(200).json({ laboratory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create lab report
export const createLabReport = async (req, res) => {
  try {
    const { 
      patientId, 
      doctorId, 
      testType, 
      testDate, 
      results, 
      referenceRange, 
      interpretation, 
      reportFile,
      relatedDiagnosisId
    } = req.body;
    
    // Find the patient
    const patient = await Patient.findOne({ userId: patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Find the doctor
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Find the laboratory
    const laboratory = await Laboratory.findOne({ userId: req.user._id });
    if (!laboratory) {
      return res.status(404).json({ message: 'Laboratory profile not found' });
    }
    
    // Create lab report
    const labReport = new LabReport({
      patient: patient._id,
      doctor: doctor._id,
      laboratory: laboratory._id,
      testType,
      testDate: testDate || new Date(),
      results,
      referenceRange,
      interpretation,
      reportFile,
      isHospitalLab: laboratory.isHospitalLab,
      relatedDiagnosis: relatedDiagnosisId,
      status: 'completed'
    });
    
    await labReport.save();
    
    res.status(201).json({
      message: 'Laboratory report created successfully',
      labReport
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lab reports
export const getLabReports = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    
    // Find the laboratory
    const laboratory = await Laboratory.findOne({ userId: req.user._id });
    if (!laboratory) {
      return res.status(404).json({ message: 'Laboratory profile not found' });
    }
    
    let searchQuery = { laboratory: laboratory._id };
    
    // If patient ID is provided, filter by patient
    if (patientId) {
      const patient = await Patient.findOne({ userId: patientId });
      if (patient) {
        searchQuery.patient = patient._id;
      }
    }
    
    // If doctor ID is provided, filter by doctor
    if (doctorId) {
      const doctor = await Doctor.findOne({ userId: doctorId });
      if (doctor) {
        searchQuery.doctor = doctor._id;
      }
    }
    
    // Filter by status if provided
    if (status) {
      searchQuery.status = status;
    }
    
    // Find lab reports
    const labReports = await LabReport.find(searchQuery)
      .populate({
        path: 'patient',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('relatedDiagnosis')
      .sort({ testDate: -1 });
    
    res.status(200).json({ labReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update laboratory information
export const updateLaboratory = async (req, res) => {
  try {
    const { name, licenseNumber, address, services, operatingHours, contactNumber, email } = req.body;
    
    const laboratory = await Laboratory.findOne({ userId: req.user._id });
    
    if (!laboratory) {
      return res.status(404).json({ message: 'Laboratory profile not found' });
    }
    
    // Update fields if provided
    if (name) laboratory.name = name;
    if (licenseNumber) laboratory.licenseNumber = licenseNumber;
    if (address) laboratory.address = address;
    if (services) laboratory.services = services;
    if (operatingHours) laboratory.operatingHours = operatingHours;
    if (contactNumber) laboratory.contactNumber = contactNumber;
    if (email) laboratory.email = email;
    
    await laboratory.save();
    
    res.status(200).json({
      message: 'Laboratory information updated successfully',
      laboratory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};