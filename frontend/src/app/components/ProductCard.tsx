import React, { useState } from 'react';
import { Link } from 'react-router';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, language } = useStore();
  const t = useTranslation(language);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50"
        style={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Image Container */}
        <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-muted/20">
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discount && (
              <span className="px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                -{product.discount}%
              </span>
            )}
            {product.isBestseller && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                New
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-secondary text-white'
                : 'bg-white/80 text-foreground hover:bg-secondary hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="px-4 py-2 bg-white rounded-full text-foreground font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4" />
              {t('quickView')}
            </button>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {product.brand}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.subcategory}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-['Montserrat'] font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="price text-xl text-secondary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="price text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('addToCart')}
          </button>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};
