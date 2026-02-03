const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.CS_SECRET_KEY || 'CS_SECRET_KEY';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ msg: 'Token format should be: Bearer <token>' });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, secret);
    
    // Set user info on request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ msg: 'You are not authenticated' });
  }
};

// Alias for protect
const protect = authMiddleware;

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
};

// Teacher only middleware
const teacherOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Teachers only.' });
  }
};

module.exports = authMiddleware;
module.exports.protect = protect;
module.exports.adminOnly = adminOnly;
module.exports.teacherOnly = teacherOnly;