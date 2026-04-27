const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const initialProducts = [
  {
    category: 'beauty', brand: 'Sofia',
    name: 'Sofia Glow Serum', price: 89000, originalPrice: 120000,
    discount: 26, rating: 4.8, reviews: 234, stock: 50,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    isBestseller: true, isLatest: false,
    description: 'Yuzingizni porlating. Vitamin C va hyaluronic acid bilan boyitilgan.',
  },
  {
    category: 'beauty', brand: 'Sofia',
    name: 'Sofia Matte Lipstick', price: 45000, originalPrice: 60000,
    discount: 25, rating: 4.6, reviews: 189, stock: 120,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=400',
    isBestseller: true, isLatest: false,
    description: '24 soat davom etuvchi mat rangli lab kremi.',
  },
  {
    category: 'smartphone', brand: 'Apple',
    name: 'iPhone 16 Pro Max', price: 15990000, originalPrice: 17000000,
    discount: 6, rating: 4.9, reviews: 892, stock: 15,
    image: 'https://images.unsplash.com/photo-1710481539571-e2a0b9b3b42c?w=400',
    isBestseller: true, isLatest: true,
    description: 'A18 Pro chip, Titanium dizayn, ProRAW kamera.',
    colors: ['Black', 'White', 'Titanium'],
    storage: ['256GB', '512GB', '1TB'],
  },
  {
    category: 'smartphone', brand: 'Samsung',
    name: 'Samsung Galaxy S25 Ultra', price: 14500000, originalPrice: 15500000,
    discount: 6, rating: 4.8, reviews: 654, stock: 22,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    isBestseller: true, isLatest: true,
    description: 'Galaxy AI, S Pen, 200MP kamera.',
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium White'],
    storage: ['256GB', '512GB', '1TB'],
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sofia-shop');
    console.log('Connected to MongoDB for seeding...');
    
    // Clean and seed
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log('Database seeded with initial products!');
    
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
