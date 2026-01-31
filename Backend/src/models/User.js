const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const notificationPreferencesSchema = new mongoose.Schema({
  emailNotifications: { type: Boolean, default: true },
  courseAnnouncements: { type: Boolean, default: true },
  curriculumUpdates: { type: Boolean, default: true },
  requestUpdates: { type: Boolean, default: true },
  weeklyDigest: { type: Boolean, default: false },
  marketingEmails: { type: Boolean, default: false }
}, { _id: false });

const appearancePreferencesSchema = new mongoose.Schema({
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  language: { type: String, default: 'en' },
  fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  compactMode: { type: Boolean, default: false }
}, { _id: false });

const privacyPreferencesSchema = new mongoose.Schema({
  profileVisibility: { type: String, enum: ['public', 'institution', 'private'], default: 'institution' },
  showEmail: { type: Boolean, default: false },
  showActivity: { type: Boolean, default: true },
  allowDataCollection: { type: Boolean, default: true }
}, { _id: false });

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
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  department: {
    type: String, // Subject/Department
    default: ''
  },
  designation: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  // Settings preferences
  notificationPreferences: {
    type: notificationPreferencesSchema,
    default: () => ({})
  },
  appearancePreferences: {
    type: appearancePreferencesSchema,
    default: () => ({})
  },
  privacyPreferences: {
    type: privacyPreferencesSchema,
    default: () => ({})
  },
  // Security
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  activeSessions: [{
    device: String,
    browser: String,
    ip: String,
    lastActive: Date,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to generate token
userSchema.methods.generateToken = function () {
  const secret = process.env.CS_SECRET_KEY;
  if (!secret) {
    throw new Error('CS_SECRET_KEY environment variable is required');
  }
  return jwt.sign({
    userId: this._id,
    email: this.email,
    role: this.role
  }, secret, { expiresIn: '24h' });
};

// Static method for login
userSchema.statics.findByEmailAndPasswordForAuth = async function (email, password) {
  console.log('Login attempt for email:', email);
  const user = await this.findOne({ email });
  if (!user) {
    console.log('User not found for email:', email);
    throw new Error('Invalid credentials');
  }

  console.log('User found, checking password...');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Password mismatch for user:', email);
    throw new Error('Invalid credentials');
  }

  console.log('Login successful for user:', email);
  return user;
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);