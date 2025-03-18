import Pharmacy from '../models/Pharmacy.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';

// Get pharmacy profile
export const getPharmacyProfile = async (req, res) => {
  try {
    const pharmacyId = req.params.id || req.user._id;
    
    const pharmacy = await Pharmacy.findOne({ userId: pharmacyId })
      .populate('userId', 'firstName lastName email contactNumber profileImage')
      .populate('hospital', 'name address');
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }

    res.status(200).json({ pharmacy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record medication purchase
export const recordPurchase = async (req, res) => {
  try {
    const { prescriptionId, medications, invoiceNumber } = req.body;
    
    // Find the prescription
    const prescription = await Prescription.findById(prescriptionId);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Find the pharmacy
    const pharmacy = await Pharmacy.findOne({ userId: req.user._id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }
    
    // Update prescription with purchase details
    prescription.purchasedFrom = pharmacy.isHospitalPharmacy ? 'hospital_pharmacy' : 'outside_pharmacy';
    prescription.pharmacyDetails = {
      pharmacyId: pharmacy._id,
      purchaseDate: new Date(),
      invoiceNumber
    };
    
    // Update medication list if provided
    if (medications && Array.isArray(medications)) {
      prescription.medications = medications;
    }
    
    await prescription.save();
    
    res.status(200).json({
      message: 'Medication purchase recorded successfully',
      prescription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get prescriptions for verification
export const getPrescriptions = async (req, res) => {
  try {
    const { patientId, status } = req.query;
    
    let searchQuery = {};
    
    // If patient ID is provided, filter by patient
    if (patientId) {
      // Find the patient
      const patient = await Patient.findOne({ userId: patientId });
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      searchQuery.patient = patient._id;
    }
    
    // Filter by status if provided
    if (status) {
      searchQuery.status = status;
    }
    
    // Find prescriptions
    const prescriptions = await Prescription.find(searchQuery)
      .populate({
        path: 'patient',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('hospital', 'name')
      .populate('diagnosis', 'diagnosisDetails condition')
      .sort({ date: -1 });
    
    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update pharmacy information
export const updatePharmacy = async (req, res) => {
  try {
    const { name, licenseNumber, address, operatingHours, contactNumber, email } = req.body;
    
    const pharmacy = await Pharmacy.findOne({ userId: req.user._id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }
    
    // Update fields if provided
    if (name) pharmacy.name = name;
    if (licenseNumber) pharmacy.licenseNumber = licenseNumber;
    if (address) pharmacy.address = address;
    if (operatingHours) pharmacy.operatingHours = operatingHours;
    if (contactNumber) pharmacy.contactNumber = contactNumber;
    if (email) pharmacy.email = email;
    
    await pharmacy.save();
    
    res.status(200).json({
      message: 'Pharmacy information updated successfully',
      pharmacy
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pharmacy purchase history
export const getPurchaseHistory = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ userId: req.user._id });
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }
    
    // Find all prescriptions filled by this pharmacy
    const prescriptions = await Prescription.find({ 'pharmacyDetails.pharmacyId': pharmacy._id })
      .populate({
        path: 'patient',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate({
        path: 'doctor',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('hospital', 'name')
      .sort({ 'pharmacyDetails.purchaseDate': -1 });
    
    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};