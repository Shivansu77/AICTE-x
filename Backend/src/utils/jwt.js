const jwt = require('jsonwebtoken');

// Better to use environment variable
const CS_SECRET_KEY = process.env.CS_SECRET_KEY || 'CS_SECRET_KEY';

const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    
    return jwt.sign(payload, CS_SECRET_KEY, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, CS_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };