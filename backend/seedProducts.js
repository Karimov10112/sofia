const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const initialProducts = [
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
