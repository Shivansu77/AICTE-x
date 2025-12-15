const jwt = require('jsonwebtoken');
const User = require('../models/user');
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

module.exports = authMiddleware;