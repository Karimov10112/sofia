export interface Product {
  id: string;
  name: string;
  category: 'smartphone';
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
    id: 'smartphone',
    name: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    count: products.filter(p => p.category === 'smartphone').length
  }
];

export const brands = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'Google',
  'OnePlus'
];
