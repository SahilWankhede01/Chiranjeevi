const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkeyforchiranjeeviayurveda123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, age, gender, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Determine role. Enforce 'patient' unless email matches one of the allowed doctor emails
    let assignedRole = 'patient';
    const doctorEmailsEnv = process.env.DOCTOR_EMAILS || process.env.DOCTOR_EMAIL || 'yateshgahukar@gmail.com';
    const allowedDoctorEmails = doctorEmailsEnv.split(',').map(e => e.trim().toLowerCase());
    
    if (allowedDoctorEmails.includes(email.toLowerCase())) {
      assignedRole = 'doctor';
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      age: age || null,
      gender: gender || '',
      role: assignedRole,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          age: user.age,
          gender: user.gender,
          avatar: user.avatar,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          age: user.age,
          gender: user.gender,
          avatar: user.avatar,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          age: user.age,
          gender: user.gender,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.age = req.body.age !== undefined ? req.body.age : user.age;
      user.gender = req.body.gender || user.gender;
      
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          age: updatedUser.age,
          gender: updatedUser.gender,
          avatar: updatedUser.avatar,
          token: generateToken(updatedUser._id),
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/auth/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/auth/notifications/:id
// @access  Private
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getNotifications,
  markNotificationRead,
};
