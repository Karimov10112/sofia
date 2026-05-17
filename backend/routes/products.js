const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, adminOnly } = require('../middleware/auth');

// GET /api/products - Get all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, search, limit = 20, page = 1 } = req.query;

    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({ success: true, total, page: Number(page), products });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching products.' });
  }
});

// GET /api/products/bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const bestsellers = await Product.find({ isBestseller: true }).limit(10);
    res.json({ success: true, products: bestsellers });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// 🔒 ADMIN ONLY ROUTES 🔒

// POST /api/products - Create new product
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const productData = req.body;
    // Default values if missing
    if (!productData.isLatest) productData.isLatest = true;
    
    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found.' });
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
