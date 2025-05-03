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

// Generate and download patient report
export const generatePatientReport = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Fetch patient details
    const patient = await Patient.findOne({ userId: patientId }).populate('userId', 'firstName lastName email');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the file name
    const fileName = `Patient_Report_${patient.userId.firstName}_${patient.userId.lastName}.pdf`;

    // Set the response headers for downloading the file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('Patient Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${patient.userId.firstName} ${patient.userId.lastName}`);
    doc.text(`Email: ${patient.userId.email}`);
    doc.text(`Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Blood Type: ${patient.bloodType || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(16).text('Allergies:', { underline: true });
    if (patient.allergies.length > 0) {
      patient.allergies.forEach((allergy, index) => {
        doc.text(`${index + 1}. ${allergy}`);
      });
    } else {
      doc.text('No allergies recorded.');
    }
    doc.moveDown();

    doc.fontSize(16).text('Medical History:', { underline: true });
    if (patient.medicalHistory.length > 0) {
      patient.medicalHistory.forEach((history, index) => {
        doc.text(`${index + 1}. Condition: ${history.condition}`);
        doc.text(`   Diagnosed At: ${new Date(history.diagnosedAt).toLocaleDateString()}`);
        doc.text(`   Notes: ${history.notes}`);
        doc.moveDown();
      });
    } else {
      doc.text('No medical history recorded.');
    }
    doc.moveDown();

    doc.fontSize(16).text('Emergency Contact:', { underline: true });
    if (patient.emergencyContact) {
      doc.text(`Name: ${patient.emergencyContact.name}`);
      doc.text(`Relationship: ${patient.emergencyContact.relationship}`);
      doc.text(`Contact Number: ${patient.emergencyContact.contactNumber}`);
    } else {
      doc.text('No emergency contact recorded.');
    }

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error generating patient report:', error);
    res.status(500).json({ message: 'Failed to generate patient report.' });
  }
};