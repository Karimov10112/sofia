import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  phone?: string;
  city?: string;
  address?: string;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: Product[];
  language: 'uz' | 'ru' | 'en';
  darkMode: boolean;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  addToCart: (product: Product, quantity?: number, color?: string, storage?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  setLanguage: (lang: 'uz' | 'ru' | 'en') => void;
  toggleDarkMode: () => void;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [language, setLanguage] = useState<'uz' | 'ru' | 'en'>('uz');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loginUser = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    try {
      localStorage.setItem('sofia-user', JSON.stringify(userData));
      localStorage.setItem('sofia-token', userToken);
    } catch (e) {
      console.error('LocalStorage save error', e);
    }
  };

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sofia-cart');
      const savedWishlist = localStorage.getItem('sofia-wishlist');
      const savedLanguage = localStorage.getItem('sofia-language');
      const savedDarkMode = localStorage.getItem('sofia-darkMode');
      const savedUser = localStorage.getItem('sofia-user');
      const savedToken = localStorage.getItem('sofia-token');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedLanguage) setLanguage(savedLanguage as 'uz' | 'ru' | 'en');
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    } catch (e) {
      console.error('LocalStorage load error, clearing data', e);
      // If error, don't crash, just start with defaults
    }

    // Handle Google OAuth callback token in URL
    try {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      const urlUser = params.get('user');
      if (urlToken && urlUser) {
        const parsedUser = JSON.parse(decodeURIComponent(urlUser));
        loginUser(parsedUser, urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.error('URL params error', e);
    }
  }, []);

  useEffect(() => { 
    try { localStorage.setItem('sofia-cart', JSON.stringify(cart)); } catch (e) {}
  }, [cart]);
  
  useEffect(() => { 
    try { localStorage.setItem('sofia-wishlist', JSON.stringify(wishlist)); } catch (e) {}
  }, [wishlist]);
  
  useEffect(() => { 
    try { localStorage.setItem('sofia-language', language); } catch (e) {}
  }, [language]);
  
  useEffect(() => {
    try {
      localStorage.setItem('sofia-darkMode', JSON.stringify(darkMode));
      document.documentElement.classList.toggle('dark', darkMode);
    } catch (e) {}
  }, [darkMode]);

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sofia-user');
    localStorage.removeItem('sofia-token');
  };

  const addToCart = (product: Product, quantity = 1, color?: string, storage?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedColor === color && i.selectedStorage === storage);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.selectedColor === color && i.selectedStorage === storage
            ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity, selectedColor: color, selectedStorage: storage }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(i => i.id !== productId));
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
  };
  const clearCart = () => setCart([]);
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => prev.find(i => i.id === product.id) ? prev.filter(i => i.id !== product.id) : [...prev, product]);
  };
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const cartTotal = cart.reduce((t, i) => t + (i.price || 0) * (i.quantity || 1), 0);
  const cartCount = cart.reduce((c, i) => c + (i.quantity || 1), 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, language, darkMode, user, token,
      isAuthenticated: !!user && !!token,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      toggleWishlist, setLanguage, toggleDarkMode,
      loginUser, logoutUser, cartTotal, cartCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
