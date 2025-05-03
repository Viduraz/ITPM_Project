import Review from "../models/Review.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Patient only)
export const createReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    console.log("Review request received:", req.body);
    console.log("User from auth:", req.user);

    // Validate inputs
    if (!doctorId || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "DoctorId, rating and comment are required" });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get patient information from the authenticated user
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Check if patient has already reviewed this doctor
    const existingReview = await Review.findOne({
      doctor: doctor._id,
      patient: patient._id,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.date = new Date();

      await existingReview.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review: existingReview,
      });
    }

    // Create new review
    const review = new Review({
      doctor: doctor._id,
      patient: patient._id,
      rating,
      comment,
      verified: true,
      date: new Date(),
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Review creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a doctor
// @route   GET /api/reviews/doctor/:id
// @access  Public
export const getDoctorReviews = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get all reviews for this doctor
    const reviews = await Review.find({ doctor: doctor._id })
      .populate({
        path: "patient",
        populate: {
          path: "userId",
          select: "firstName lastName profileImage",
        },
      })
      .sort({ date: -1 });

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = totalRating / reviews.length;
    }

    // Format reviews for response
    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      verified: review.verified,
      name: `${review.patient.userId.firstName} ${review.patient.userId.lastName}`,
      profileImage: review.patient.userId.profileImage,
    }));

    res.status(200).json({
      reviews: formattedReviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin, or Patient who wrote the review)
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check authorization - only admin or the patient who wrote the review can delete
    const patient = await Patient.findOne({ userId: req.user._id });

    if (
      req.user.role !== "admin" &&
      (!patient || review.patient.toString() !== patient._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await Review.deleteOne({ _id: reviewId });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get average rating for a doctor
// @route   GET /api/reviews/rating/:doctorId
// @access  Public
export const getDoctorRating = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get all ratings for this doctor
    const reviews = await Review.find({ doctor: doctor._id }, "rating");

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = totalRating / reviews.length;
    }

    res.status(200).json({
      doctorId,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a patient
// @route   GET /api/reviews/patient
// @access  Private (Patient only)
export const getPatientReviews = async (req, res) => {
  try {
    // Get patient information
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Get all reviews written by this patient
    const reviews = await Review.find({ patient: patient._id })
      .populate({
        path: "doctor",
        populate: {
          path: "userId",
          select: "firstName lastName",
        },
      })
      .sort({ date: -1 });

    // Format reviews for response
    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      doctorId: review.doctor._id,
      doctorName: `Dr. ${review.doctor.userId.firstName} ${review.doctor.userId.lastName}`,
      specialization: review.doctor.specialization,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
    }));

    res.status(200).json({
      reviews: formattedReviews,
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
