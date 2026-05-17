const mongoose = require('mongoose');
const mockify = require('../utils/mockify');
const MockDB = require('../utils/mockDB');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
  avatar: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
const mockUser = new MockDB('users');

module.exports = mockify(UserModel, mockUser, 'users');
