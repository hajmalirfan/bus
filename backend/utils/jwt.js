const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'busbookingsecretkey2024', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res
        .status(statusCode)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

module.exports = { generateToken, sendTokenResponse };
