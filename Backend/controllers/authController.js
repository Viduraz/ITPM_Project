import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Pharmacy from '../models/Pharmacy.js';
import Laboratory from '../models/Laboratory.js';
import DataEntry from '../models/DataEntry.js';

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

    // If user is a data entry operator, create corresponding profile
    if (role === 'dataentry') {
      const dataEntry = new DataEntry({
        userId: user._id,
        workShift: 'Morning',
        department: 'General'
      });
      await dataEntry.save();
    }

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

    // Get profile data based on role
    let profileData = null;
    if (user.role === 'dataentry') {
      profileData = await DataEntry.findOne({ userId: user._id });
      console.log('Data entry user authenticated:', user);
    }

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      profile: profileData
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

// Register data entry operator
export const registerDataEntry = async (req, res) => {
  try {
    const { userId, workShift, supervisor, department } = req.body;

    // Check if data entry profile already exists
    const existingDataEntry = await DataEntry.findOne({ userId });
    if (existingDataEntry) {
      return res.status(400).json({ message: 'Data Entry profile already exists for this user' });
    }

    const dataEntry = new DataEntry({
      userId,
      workShift: workShift || 'Morning',
      supervisor,
      department: department || 'General',
      assignedTasks: []
    });

    await dataEntry.save();

    // Update user role if needed
    const user = await User.findById(userId);
    if (user && user.role !== 'dataentry') {
      user.role = 'dataentry';
      await user.save();
    }

    res.status(201).json({
      message: 'Data Entry operator registered successfully',
      dataEntry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get profile data based on role
    let profileData = null;
    if (user.role === 'dataentry') {
      profileData = await DataEntry.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profileData = await Doctor.findOne({ userId: user._id });
    } else if (user.role === 'patient') {
      profileData = await Patient.findOne({ userId: user._id });
    } else if (user.role === 'pharmacy') {
      profileData = await Pharmacy.findOne({ userId: user._id });
    } else if (user.role === 'laboratory') {
      profileData = await Laboratory.findOne({ userId: user._id });
    }

    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users by role
export const getAllUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role
    const validRoles = ['patient', 'doctor', 'pharmacy', 'laboratory', 'dataentry', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Find all users with the specified role
    const users = await User.find({ role }).select('-password');
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: `No users found with role: ${role}` });
    }
    
    // If role is patient, we might want to include more detailed information
    if (role === 'patient') {
      // Get patient profiles and join with user data
      const userIds = users.map(user => user._id);
      const patientProfiles = await Patient.find({ userId: { $in: userIds } });
      
      // Create a map of patient profiles by userId for easy lookup
      const profileMap = patientProfiles.reduce((map, profile) => {
        map[profile.userId.toString()] = profile;
        return map;
      }, {});
      
      // Join user data with profile data
      const patientsWithProfiles = users.map(user => ({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber,
          IdNumber: user.IdNumber
        },
        profile: profileMap[user._id.toString()] || null
      }));
      
      return res.status(200).json({
        count: patientsWithProfiles.length,
        patients: patientsWithProfiles
      });
    }
    
    // For other roles, just return the user data
    const usersData = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      IdNumber: user.IdNumber
    }));
    
    res.status(200).json({
      count: usersData.length,
      users: usersData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, contactNumber, IdNumber } = req.body;

    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic user information
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.contactNumber = contactNumber || user.contactNumber;
    user.IdNumber = IdNumber || user.IdNumber;

    // Save the updated user
    await user.save();

    // If user is a patient, update their profile if profile data is provided
    if (user.role === 'patient' && req.body.profile) {
      const { dateOfBirth, gender, bloodType, allergies, medicalHistory, emergencyContact } = req.body.profile;
      
      // Find the patient profile
      let patientProfile = await Patient.findOne({ userId: user._id });
      
      if (patientProfile) {
        // Update existing patient profile
        patientProfile.dateOfBirth = dateOfBirth || patientProfile.dateOfBirth;
        patientProfile.gender = gender || patientProfile.gender;
        patientProfile.bloodType = bloodType || patientProfile.bloodType;
        
        // Handle arrays or objects that should be replaced rather than || operation
        if (allergies) patientProfile.allergies = allergies;
        if (medicalHistory) patientProfile.medicalHistory = medicalHistory;
        if (emergencyContact) patientProfile.emergencyContact = emergencyContact;
        
        await patientProfile.save();
      }
    }

    res.status(200).json({ 
      message: 'User updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        IdNumber: user.IdNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user to delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated profile based on user role
    if (user.role === 'patient') {
      await Patient.findOneAndDelete({ userId: user._id });
    } else if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ userId: user._id });
    } else if (user.role === 'pharmacy') {
      await Pharmacy.findOneAndDelete({ userId: user._id });
    } else if (user.role === 'laboratory') {
      await Laboratory.findOneAndDelete({ userId: user._id });
    } else if (user.role === 'dataentry') {
      await DataEntry.findOneAndDelete({ userId: user._id });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User and associated profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find the user
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get profile data based on role
    let profileData = null;
    if (user.role === 'patient') {
      profileData = await Patient.findOne({ userId: user._id });
    } else if (user.role === 'doctor') {
      profileData = await Doctor.findOne({ userId: user._id });
    } else if (user.role === 'pharmacy') {
      profileData = await Pharmacy.findOne({ userId: user._id });
    } else if (user.role === 'laboratory') {
      profileData = await Laboratory.findOne({ userId: user._id });
    } else if (user.role === 'dataentry') {
      profileData = await DataEntry.findOne({ userId: user._id });
    }

    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        IdNumber: user.IdNumber,
        role: user.role
      },
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};