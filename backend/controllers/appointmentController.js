const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailService');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res, next) => {
  try {
    const {
      fullName,
      age,
      gender,
      mobileNumber,
      disease,
      preferredDate,
      preferredTime,
    } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      fullName,
      age,
      gender,
      mobileNumber,
      disease,
      preferredDate,
      preferredTime,
      status: 'Pending',
    });

    // Create Notification for the Patient
    await Notification.create({
      user: req.user._id,
      title: 'Appointment Booked Successfully',
      message: `Your appointment request for ${preferredDate} at ${preferredTime} has been submitted. Status: Pending.`,
    });

    // Find doctors and create notifications for them
    const doctors = await User.find({ role: 'doctor' });
    for (const doc of doctors) {
      await Notification.create({
        user: doc._id,
        title: 'New Appointment Booking',
        message: `A new appointment has been requested by ${fullName} for ${preferredDate} at ${preferredTime}.`,
      });
    }

    // Send email to Patient (if email configured)
    await sendEmail({
      to: req.user.email,
      subject: 'Appointment Received - SHREE CHIRANJEEVI Ayurveda Clinic',
      html: `
        <h3>Dear ${req.user.name},</h3>
        <p>We have received your appointment request at <strong>SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic</strong>.</p>
        <p><strong>Appointment Details:</strong></p>
        <ul>
          <li><strong>Patient Name:</strong> ${fullName}</li>
          <li><strong>Preferred Date:</strong> ${preferredDate}</li>
          <li><strong>Preferred Time Slot:</strong> ${preferredTime}</li>
          <li><strong>Disease/Problem:</strong> ${disease}</li>
          <li><strong>Status:</strong> Pending approval</li>
        </ul>
        <p>Dr. Yatesh Naresh Gahukar will review your request shortly. You will receive an email update once your booking is approved or processed.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic</strong></p>
      `,
    });

    // Send email notification to Doctor
    const doctorMailTarget = process.env.DOCTOR_EMAIL || 'yateshgahukar@gmail.com';
    await sendEmail({
      to: doctorMailTarget,
      subject: `New Appointment Request - ${fullName}`,
      html: `
        <h3>New Consultation Request</h3>
        <p>A new appointment has been scheduled by a patient on the online portal.</p>
        <ul>
          <li><strong>Patient Name:</strong> ${fullName} (${age} years, ${gender})</li>
          <li><strong>Contact:</strong> ${mobileNumber}</li>
          <li><strong>Preferred Date:</strong> ${preferredDate}</li>
          <li><strong>Preferred Time Slot:</strong> ${preferredTime}</li>
          <li><strong>Disease/Problem:</strong> ${disease}</li>
        </ul>
        <p>Please log in to your admin panel dashboard to Approve or Reject this request.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current patient's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // Ensure it belongs to this patient
    if (appointment.patient.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to cancel this appointment');
    }

    if (appointment.status === 'Completed') {
      res.status(400);
      throw new Error('Cannot cancel a completed appointment');
    }

    appointment.status = 'Rejected';
    appointment.doctorRemarks = 'Cancelled by Patient';
    await appointment.save();

    // Create Notification for the Patient
    await Notification.create({
      user: req.user._id,
      title: 'Appointment Cancelled',
      message: `You have successfully cancelled your appointment scheduled on ${new Date(appointment.preferredDate).toDateString()}.`,
    });

    // Notify doctors
    const doctors = await User.find({ role: 'doctor' });
    for (const doc of doctors) {
      await Notification.create({
        user: doc._id,
        title: 'Appointment Cancelled by Patient',
        message: `Appointment for ${appointment.fullName} scheduled on ${new Date(appointment.preferredDate).toDateString()} was cancelled by the patient.`,
      });
    }

    res.json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (Doctor/Admin)
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, date, status } = req.query;

    const query = {};

    // Search by patient name (case-insensitive regex)
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }

    // Filter by exact date
    if (date) {
      const searchDate = new Date(date);
      // Set range for the whole day
      const start = new Date(searchDate.setHours(0, 0, 0, 0));
      const end = new Date(searchDate.setHours(23, 59, 59, 999));
      query.preferredDate = { $gte: start, $lte: end };
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    const count = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .sort({ preferredDate: -1, preferredTime: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      success: true,
      data: appointments,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Approve/Reject/Complete)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, doctorRemarks } = req.body;
    
    if (!['Approved', 'Rejected', 'Completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status update. Choose Approved, Rejected, or Completed.');
    }

    const appointment = await Appointment.findById(req.params.id).populate('patient');

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    appointment.status = status;
    if (doctorRemarks !== undefined) {
      appointment.doctorRemarks = doctorRemarks;
    }
    
    const updatedAppointment = await appointment.save();

    // Create Notification for the Patient
    await Notification.create({
      user: appointment.patient._id,
      title: `Appointment Status: ${status}`,
      message: `Your appointment request for ${new Date(appointment.preferredDate).toDateString()} is now ${status}. Remarks: ${doctorRemarks || 'None'}`,
    });

    // Send Status Email Update to Patient
    await sendEmail({
      to: appointment.patient.email,
      subject: `Appointment Status Update: ${status} - SHREE CHIRANJEEVI Clinic`,
      html: `
        <h3>Dear ${appointment.patient.name},</h3>
        <p>Your appointment status has been updated by <strong>Dr. Yatesh Naresh Gahukar</strong> at <strong>SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic</strong>.</p>
        <p><strong>Updated Details:</strong></p>
        <ul>
          <li><strong>Appointment Date:</strong> ${new Date(appointment.preferredDate).toDateString()}</li>
          <li><strong>Time Slot:</strong> ${appointment.preferredTime}</li>
          <li><strong>New Status:</strong> <strong style="color: ${status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'blue'}">${status}</strong></li>
          <li><strong>Doctor's Remarks:</strong> ${doctorRemarks || 'N/A'}</li>
        </ul>
        <p>If you have any questions, you can contact the clinic directly via phone or WhatsApp.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>SHREE CHIRANJEEVI Ayurveda & Panchakarma Clinic</strong></p>
      `,
    });

    res.json({
      success: true,
      message: `Appointment successfully marked as ${status}`,
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics metrics
// @route   GET /api/appointments/analytics
// @access  Private (Doctor)
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const approvedAppointments = await Appointment.countDocuments({ status: 'Approved' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Get 5 upcoming approved/pending appointments
    const upcomingAppointments = await Appointment.find({
      status: { $in: ['Pending', 'Approved'] },
      preferredDate: { $gte: new Date().setHours(0,0,0,0) },
    })
      .populate('patient', 'name phone')
      .sort({ preferredDate: 1, preferredTime: 1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        totalPatients,
        upcomingAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDashboardAnalytics,
};
