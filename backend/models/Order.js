const mongoose = require('mongoose');
const mockify = require('../utils/mockify');
const MockDB = require('../utils/mockDB');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: Array,
  deliveryInfo: Object,
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
const mockOrder = new MockDB('orders');

module.exports = mockify(OrderModel, mockOrder, 'orders');
