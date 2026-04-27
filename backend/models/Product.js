const mongoose = require('mongoose');
const mockify = require('../utils/mockify');
const MockDB = require('../utils/mockDB');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
  isBestseller: { type: Boolean, default: false },
  isLatest: { type: Boolean, default: true },
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);
const mockProduct = new MockDB('products');

module.exports = mockify(ProductModel, mockProduct, 'products');
