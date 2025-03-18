import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Pharmacy from '../models/Pharmacy.js';
import Laboratory from '../models/Laboratory.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// Register user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, IdNumber, password, role, contactNumber, profileImage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      IdNumber,
      password,
      role,
      contactNumber,
      profileImage
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register patient
export const registerPatient = async (req, res) => {
  try {
    const { userId, dateOfBirth, gender, bloodType, allergies, medicalHistory, emergencyContact } = req.body;

    const patient = new Patient({
      userId,
      dateOfBirth,
      gender,
      bloodType,
      allergies,
      medicalHistory,
      emergencyContact
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register doctor
export const registerDoctor = async (req, res) => {
  try {
    const { userId, specialization, licenseNumber, hospitalAffiliations, experience, qualifications } = req.body;

    const doctor = new Doctor({
      userId,
      specialization,
      licenseNumber,
      hospitalAffiliations,
      experience,
      qualifications
    });

    await doctor.save();

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register pharmacy
export const registerPharmacy = async (req, res) => {
  try {
    const { userId, name, licenseNumber, address, isHospitalPharmacy, hospital, operatingHours, contactNumber, email } = req.body;

    const pharmacy = new Pharmacy({
      userId,
      name,
      licenseNumber,
      address,
      isHospitalPharmacy,
      hospital,
      operatingHours,
      contactNumber,
      email
    });

    await pharmacy.save();

    res.status(201).json({
      message: 'Pharmacy registered successfully',
      pharmacy
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register laboratory
export const registerLaboratory = async (req, res) => {
  try {
    const { userId, name, licenseNumber, address, isHospitalLab, hospital, services, operatingHours, contactNumber, email } = req.body;

    const laboratory = new Laboratory({
      userId,
      name,
      licenseNumber,
      address,
      isHospitalLab,
      hospital,
      services,
      operatingHours,
      contactNumber,
      email
    });

    await laboratory.save();

    res.status(201).json({
      message: 'Laboratory registered successfully',
      laboratory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};