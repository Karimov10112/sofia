const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, adminOnly, superAdminOnly } = require('../middleware/auth');

// ─── GET /api/admin/users ───────────────────────────────────────────────────
// Accessible by Admin & Super Admin
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password -otp').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/admin/users/:id/role ──────────────────────────────────────────
// Accessible ONLY by Super Admin
router.put('/users/:id/role', authenticate, superAdminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent Super Admin from demoting themselves by mistake
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({ success: true, user: targetUser.toSafeObject(), message: `Role updated to ${role}` });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE /api/admin/users/:id ──────────────────────────────────────────
// Accessible ONLY by Super Admin
router.delete('/users/:id', authenticate, superAdminOnly, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent Super Admin from deleting themselves
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/admin/stats ───────────────────────────────────────────────────
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await require('../models/Order').countDocuments();
    const productCount = await require('../models/Product').countDocuments();
    
    // Simple revenue calculation
    const orders = await require('../models/Order').find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({
      success: true,
      stats: {
        userCount,
        orderCount,
        productCount,
        totalRevenue
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/admin/analytics ───────────────────────────────────────────────
router.get('/analytics', authenticate, adminOnly, async (req, res) => {
  try {
    const Order = require('../models/Order');
    
    // Get stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ success: true, analytics });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
