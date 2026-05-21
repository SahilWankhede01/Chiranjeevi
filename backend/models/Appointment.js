const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add full name'],
    },
    age: {
      type: Number,
      required: [true, 'Please add age'],
    },
    gender: {
      type: String,
      required: [true, 'Please select gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please add a mobile number'],
    },
    disease: {
      type: String,
      required: [true, 'Please describe the disease/problem'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please select preferred date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please select preferred time slot'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    doctorRemarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
