export interface Product {
  id: string;
  name: string;
  category: 'beauty' | 'smartphone';
  subcategory?: string;
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  description: string;
  specs?: Record<string, string>;
  colors?: string[];
  storage?: string[];
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
}

export const products: Product[] = [
  // Beauty Products
  {
    id: 'b1',
    name: 'Sofia Lux Serum',
    category: 'beauty',
    subcategory: 'Skin Care',
    brand: 'Sofia',
    price: 299000,
    oldPrice: 450000,
    discount: 34,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&q=80'
    ],
    description: 'Premium anti-aging serum with hyaluronic acid and vitamin C. Reduces wrinkles and brightens skin.',
    specs: {
      'Volume': '30ml',
      'Type': 'Serum',
      'Skin Type': 'All Types',
      'Key Ingredients': 'Hyaluronic Acid, Vitamin C, Retinol'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'b2',
    name: 'Sofia Matte Lipstick',
    category: 'beauty',
    subcategory: 'Makeup',
    brand: 'Sofia',
    price: 89000,
    oldPrice: 120000,
    discount: 26,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
      'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80'
    ],
    description: 'Long-lasting matte lipstick with rich color and comfortable wear. Available in 12 stunning shades.',
    colors: ['#DC143C', '#FF1493', '#FF69B4', '#FF6347', '#B22222', '#8B0000'],
    specs: {
      'Finish': 'Matte',
      'Volume': '3.5g',
      'Wear Time': '8+ hours',
      'Formula': 'Transfer-proof'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'b3',
    name: 'Sofia Glow Foundation',
    category: 'beauty',
    subcategory: 'Makeup',
    brand: 'Sofia',
    price: 189000,
    oldPrice: 250000,
    discount: 24,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
      'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800&q=80'
    ],
    description: 'Full coverage foundation with natural glow finish. SPF 30 protection and 24-hour wear.',
    specs: {
      'Volume': '30ml',
      'Coverage': 'Full',
      'Finish': 'Natural Glow',
      'SPF': '30'
    },
    inStock: true
  },
  {
    id: 'b4',
    name: 'Sofia Eye Palette',
    category: 'beauty',
    subcategory: 'Makeup',
    brand: 'Sofia',
    price: 159000,
    oldPrice: 220000,
    discount: 28,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
      'https://images.unsplash.com/photo-1583241800698-c318d3dccbdc?w=800&q=80'
    ],
    description: '18 highly pigmented shades in matte and shimmer finishes. Perfect for day and night looks.',
    specs: {
      'Shades': '18',
      'Finishes': 'Matte & Shimmer',
      'Weight': '25g',
      'Cruelty-Free': 'Yes'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'b5',
    name: 'Sofia Perfume Elegance',
    category: 'beauty',
    subcategory: 'Fragrance',
    brand: 'Sofia',
    price: 450000,
    oldPrice: 600000,
    discount: 25,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80'
    ],
    description: 'Luxurious eau de parfum with floral and woody notes. Long-lasting elegant fragrance.',
    specs: {
      'Volume': '100ml',
      'Type': 'Eau de Parfum',
      'Notes': 'Floral, Woody, Musky',
      'Longevity': '8-10 hours'
    },
    inStock: true
  },
  {
    id: 'b6',
    name: 'Sofia Facial Cleanser',
    category: 'beauty',
    subcategory: 'Skin Care',
    brand: 'Sofia',
    price: 129000,
    oldPrice: 180000,
    discount: 28,
    rating: 4.7,
    reviews: 345,
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80'
    ],
    description: 'Gentle foaming cleanser that removes impurities while maintaining skin moisture balance.',
    specs: {
      'Volume': '150ml',
      'Type': 'Foam Cleanser',
      'Skin Type': 'All Types',
      'pH': '5.5'
    },
    inStock: true
  },

  // Smartphones
  {
    id: 's1',
    name: 'iPhone 15 Pro Max',
    category: 'smartphone',
    subcategory: 'Premium',
    brand: 'Apple',
    price: 15900000,
    oldPrice: 17500000,
    discount: 9,
    rating: 4.9,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      'https://images.unsplash.com/photo-1695048064523-501a67d0cfa8?w=800&q=80',
      'https://images.unsplash.com/photo-1695048065001-5c93d51c0a02?w=800&q=80'
    ],
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    colors: ['#1f1f1f', '#f5f5f0', '#4a4a4a', '#2d4b73'],
    storage: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP + 12MP + 12MP',
      'Battery': '29 Hours Video',
      'Material': 'Titanium'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 's2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'smartphone',
    subcategory: 'Premium',
    brand: 'Samsung',
    price: 14200000,
    oldPrice: 15900000,
    discount: 11,
    rating: 4.8,
    reviews: 756,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
    ],
    description: 'Flagship Android phone with S Pen, 200MP camera, and AI-powered features.',
    colors: ['#1a1a1a', '#d4af37', '#6a5acd', '#708090'],
    storage: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '200MP + 50MP + 12MP + 10MP',
      'RAM': '12GB',
      'S Pen': 'Included'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 's3',
    name: 'Xiaomi 14 Pro',
    category: 'smartphone',
    subcategory: 'Mid-Range',
    brand: 'Xiaomi',
    price: 7900000,
    oldPrice: 9500000,
    discount: 17,
    rating: 4.7,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80'
    ],
    description: 'Powerful performance with Leica camera system and ultra-fast charging.',
    colors: ['#000000', '#ffffff', '#1e90ff'],
    storage: ['256GB', '512GB'],
    specs: {
      'Display': '6.73" AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP Leica Triple Camera',
      'Battery': '5000mAh',
      'Charging': '120W HyperCharge'
    },
    inStock: true
  },
  {
    id: 's4',
    name: 'Google Pixel 8 Pro',
    category: 'smartphone',
    subcategory: 'Premium',
    brand: 'Google',
    price: 11900000,
    oldPrice: 13500000,
    discount: 12,
    rating: 4.8,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'
    ],
    description: 'Best-in-class AI photography and pure Android experience with Google Tensor G3.',
    colors: ['#2c3e50', '#ecf0f1', '#3498db'],
    storage: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.7" LTPO OLED',
      'Chip': 'Google Tensor G3',
      'Camera': '50MP + 48MP + 48MP',
      'AI Features': 'Magic Eraser, Best Take',
      'Updates': '7 Years'
    },
    inStock: true
  },
  {
    id: 's5',
    name: 'OnePlus 12',
    category: 'smartphone',
    subcategory: 'Mid-Range',
    brand: 'OnePlus',
    price: 8500000,
    oldPrice: 10200000,
    discount: 17,
    rating: 4.7,
    reviews: 389,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'
    ],
    description: 'Flagship killer with Hasselblad camera, fast charging, and smooth display.',
    colors: ['#000000', '#4a5568', '#38a169'],
    storage: ['256GB', '512GB'],
    specs: {
      'Display': '6.82" AMOLED 120Hz',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP Hasselblad',
      'Battery': '5400mAh',
      'Charging': '100W SuperVOOC'
    },
    inStock: true
  },
  {
    id: 's6',
    name: 'iPhone 14',
    category: 'smartphone',
    subcategory: 'Mid-Range',
    brand: 'Apple',
    price: 9900000,
    oldPrice: 11500000,
    discount: 14,
    rating: 4.8,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1678652197950-eb62f8e5c3cf?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1678652197950-eb62f8e5c3cf?w=800&q=80',
      'https://images.unsplash.com/photo-1678652197874-969697b89c2e?w=800&q=80'
    ],
    description: 'Reliable performance with A15 Bionic chip and excellent camera system.',
    colors: ['#000000', '#ffffff', '#0000ff', '#ff0000', '#800080'],
    storage: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.1" Super Retina XDR',
      'Chip': 'A15 Bionic',
      'Camera': 'Dual 12MP',
      'Battery': '20 Hours Video',
      'Features': 'Emergency SOS'
    },
    inStock: true
  }
];

export const categories = [
  {
    id: 'beauty',
    name: 'Beauty & Cosmetics',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    count: products.filter(p => p.category === 'beauty').length
  },
  {
    id: 'smartphone',
    name: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    count: products.filter(p => p.category === 'smartphone').length
  }
];

export const brands = [
  'Sofia',
  'Apple',
  'Samsung',
  'Xiaomi',
  'Google',
  'OnePlus'
];
