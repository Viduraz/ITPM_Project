import Doctor from "../models/Doctor.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "somesecretkey", {
    expiresIn: "30d",
  });
};

// @desc    Register a new doctor
// @route   POST /api/doctors/register
// @access  Public
export const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      contactNumber,
      qualification,
      experience,
    } = req.body;

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });

    if (doctorExists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Create new doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialization,
      contactNumber,
      qualification,
      experience,
    });

    if (doctor) {
      res.status(201).json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        token: generateToken(doctor._id),
      });
    } else {
      res.status(400).json({ message: "Invalid doctor data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth doctor & get token
// @route   POST /api/doctors/login
// @access  Public
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find doctor by email
    const doctor = await Doctor.findOne({ email }).select("+password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if password matches
    const isMatch = await doctor.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      token: generateToken(doctor._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update doctor fields
    doctor.name = req.body.name || doctor.name;
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.contactNumber = req.body.contactNumber || doctor.contactNumber;
    doctor.qualification = req.body.qualification || doctor.qualification;
    doctor.experience = req.body.experience || doctor.experience;

    if (req.body.email && req.body.email !== doctor.email) {
      // Check if new email already exists
      const emailExists = await Doctor.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      doctor.email = req.body.email;
    }

    if (req.body.password) {
      doctor.password = req.body.password;
    }

    const updatedDoctor = await doctor.save();

    res.json({
      _id: updatedDoctor._id,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      specialization: updatedDoctor.specialization,
      contactNumber: updatedDoctor.contactNumber,
      qualification: updatedDoctor.qualification,
      experience: updatedDoctor.experience,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await Doctor.deleteOne({ _id: req.params.id });
    res.json({ message: "Doctor removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private
export const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { date, startTime, endTime, isAvailable } = req.body;

    // Ensure we create a date that preserves the day
    // Create a UTC date from the date string to prevent timezone issues
    const dateParts = date.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);

    // Create a date object with explicit year, month, day (in UTC)
    const formattedDate = new Date(Date.UTC(year, month, day));

    // Check if this availability slot already exists
    const existingSlotIndex = doctor.availability.findIndex((slot) => {
      const slotDate = new Date(slot.date);
      // Compare year, month, and day
      return (
        slotDate.getUTCFullYear() === formattedDate.getUTCFullYear() &&
        slotDate.getUTCMonth() === formattedDate.getUTCMonth() &&
        slotDate.getUTCDate() === formattedDate.getUTCDate() &&
        slot.startTime === startTime &&
        slot.endTime === endTime
      );
    });

    if (existingSlotIndex >= 0) {
      // Update existing slot
      doctor.availability[existingSlotIndex].isAvailable = isAvailable;
    } else {
      // Add new availability slot
      doctor.availability.push({
        date: formattedDate,
        startTime,
        endTime,
        isAvailable,
      });
    }

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
export const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Return just the availability array
    res.json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new controller method
export const updateGlobalAvailability = async (req, res) => {
  try {
    const { isAvailable, date, timeFrom, timeTo } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Create availability record
    const availabilityData = {
      date,
      isAvailable,
      hours: {
        from: timeFrom,
        to: timeTo
      }
    };

    // Find if there's an existing record for this date
    const existingAvailabilityIndex = doctor.availabilitySchedule 
      ? doctor.availabilitySchedule.findIndex(a => a.date === date)
      : -1;

    if (existingAvailabilityIndex >= 0) {
      // Update existing record
      doctor.availabilitySchedule[existingAvailabilityIndex] = availabilityData;
    } else if (!doctor.availabilitySchedule) {
      // Initialize availability schedule array if it doesn't exist
      doctor.availabilitySchedule = [availabilityData];
    } else {
      // Add new record
      doctor.availabilitySchedule.push(availabilityData);
    }

    await doctor.save();

    res.status(200).json({ 
      message: `Global availability updated successfully to ${isAvailable ? 'available' : 'not available'}`,
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};