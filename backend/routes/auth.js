const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, generateToken } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// ─── Helper ──────────────────────────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail().custom(val => {
      if (!val.endsWith('@gmail.com')) throw new Error('Faqat @gmail.com emaillari ruxsat etiladi');
      return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      if (existingUser) {
        if (existingUser.isVerified) {
          return res.status(409).json({ message: 'Email already registered. Please log in.' });
        } else {
          // Update unverified user with new OTP and details
          existingUser.name = name;
          existingUser.password = password; // will be hashed by pre-save hook
          existingUser.otp = otp;
          existingUser.otpExpires = otpExpires;
          await existingUser.save();
        }
      } else {
        await User.create({ name, email, password, provider: 'local', otp, otpExpires });
      }

      const emailSent = await sendEmail({
        to: email,
        subject: 'Sofia Shop - Kodingizni tasdiqlang',
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                 <h2>Sofia Shop</h2>
                 <p>Sizning tasdiqlash kodingiz: <strong>${otp}</strong></p>
                 <p>Kod 10 daqiqa davomida amal qiladi.</p>
               </div>`
      });

      if (!emailSent) {
        return res.status(500).json({ message: 'Email yuborishda xatolik yuz berdi. Iltimos keyinroq urinib ko\'ring.' });
      }

      res.status(201).json({ 
        message: 'Tasdiqlash kodi elektron pochtangizga yuborildi', 
        requireOtp: true, 
        email 
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
);

// ─── POST /api/auth/verify-email ─────────────────────────────────────────────
router.post(
  '/verify-email',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
      if (user.isVerified) return res.status(400).json({ message: 'Email allaqachon tasdiqlangan' });

      if (user.otp !== otp || user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'Tasdiqlash kodi noto\'g\'ri yoki muddati tugagan' });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      sendTokenResponse(user, 200, res);
    } catch (err) {
      console.error('Verify error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      if (user.provider === 'google' && !user.password) {
        return res.status(401).json({ message: 'This account uses Google login. Please sign in with Google.' });
      }

      if (user.provider === 'local' && !user.isVerified) {
        return res.status(403).json({ message: 'Iltimos, elektron pochtangizni tasdiqlang. (Please verify your email).' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      sendTokenResponse(user, 200, res);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
);

// ─── GET /api/auth/google ─────────────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// ─── GET /api/auth/google/callback ───────────────────────────────────────────
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const userStr = encodeURIComponent(JSON.stringify(req.user.toSafeObject()));
      // Redirect to frontend with token in URL (frontend picks it up)
      res.redirect(`${process.env.FRONTEND_URL}/?token=${token}&user=${userStr}`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, phone, city, address } = req.body;
      const user = await User.findById(req.user._id);
      
      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (city !== undefined) user.city = city;
      if (address !== undefined) user.address = address;
      
      await user.save();
      res.json({ success: true, user: user.toSafeObject() });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// ─── PUT /api/auth/change-password ───────────────────────────────────────────
router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const user = await User.findById(req.user._id).select('+password');

      if (!user.password) {
        return res.status(400).json({ message: 'Cannot change password for Google accounts.' });
      }

      const isMatch = await user.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      user.password = req.body.newPassword;
      await user.save();

      res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
      console.error('Change password error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', authenticate, (req, res) => {
  // JWT is stateless — client just removes the token
  res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
