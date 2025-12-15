const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'librarian'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to generate token
userSchema.methods.generateToken = function() {
  const jwt = require('jsonwebtoken');
  const secret = process.env.CS_SECRET_KEY || 'CS_SECRET_KEY';
  return jwt.sign({
    userId: this._id,
    email: this.email,
    role: this.role
  }, secret, { expiresIn: '24h' });
};

// Static method for login
userSchema.statics.findByEmailAndPasswordForAuth = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  
  return user;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);