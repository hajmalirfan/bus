const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendTokenResponse } = require('../utils/jwt');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists with this email'
        });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an email and password'
        });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Log user out
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
});

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateProfile
};
