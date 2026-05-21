const express = require('express');
const {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDashboardAnalytics,
} = require('../controllers/appointmentController');
const { protect, doctor } = require('../middleware/authMiddleware');

const router = express.Router();

// Patient routes
router.route('/')
  .post(protect, bookAppointment);
router.route('/my')
  .get(protect, getPatientAppointments);
router.route('/:id/cancel')
  .put(protect, cancelAppointment);

// Doctor/Admin routes
router.route('/doctor')
  .get(protect, doctor, getDoctorAppointments);
router.route('/analytics')
  .get(protect, doctor, getDashboardAnalytics);
router.route('/:id/status')
  .put(protect, doctor, updateAppointmentStatus);

module.exports = router;
