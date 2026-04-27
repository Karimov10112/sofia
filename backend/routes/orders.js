const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticate, adminOnly } = require('../middleware/auth');
const { getIO } = require('../config/socket');

// POST /api/orders — Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, deliveryInfo, paymentMethod, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }

    const newOrder = await Order.create({
      userId: req.user._id,
      items,
      deliveryInfo,
      paymentMethod,
      total,
      status: 'pending'
    });

    // Populate user info for real-time notification
    const orderWithUser = await Order.findById(newOrder._id).populate('userId', 'name email avatar');

    // Notify admins in real-time
    try {
      const io = getIO();
      io.to('admin-room').emit('newOrder', {
        order: orderWithUser,
        message: `Yangi buyurtma: ${deliveryInfo.name} tomonidan`
      });
    } catch (socketErr) {
      console.error('Socket notification error:', socketErr.message);
    }

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/orders — Get user's own orders
router.get('/', authenticate, async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.user._id })
                                  .sort({ createdAt: -1 });
    res.json({ success: true, orders: userOrders });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/orders/all — Get all orders (Admin only)
router.get('/all', authenticate, adminOnly, async (req, res) => {
  try {
    const allOrders = await Order.find({})
                                 .populate('userId', 'name email avatar')
                                 .sort({ createdAt: -1 });
    res.json({ success: true, orders: allOrders });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/orders/:id/status — Update order status (Admin only)
router.put('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/orders/:id — Get a specific order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // Allow user who owns it OR admin to view it
    if (order.userId.toString() !== req.user._id.toString() && !['admin', 'super_admin'].includes(req.user.role)) {
       return res.status(403).json({ message: 'Not authorized.' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/orders/:id/cancel — Cancel user's own order
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // Check ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    // Only allow cancellation if pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: 'Buyurtmani endi bekor qilib bo\'lmaydi.' });
    }

    order.status = 'cancelled';
    await order.save();

    // Notify admins about cancellation
    try {
      const io = getIO();
      io.to('admin-room').emit('orderCancelled', {
        orderId: order._id,
        message: `Buyurtma bekor qilindi: #${order._id.toString().slice(-6)}`
      });
    } catch (sErr) {}

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
