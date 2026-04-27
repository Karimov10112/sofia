import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';

export const WishlistPage: React.FC = () => {
  const { wishlist, addToCart, toggleWishlist, language } = useStore();
  const t = useTranslation(language);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <Heart className="w-16 h-16 text-secondary" />
          </div>
          <h2 className="font-['Montserrat'] text-2xl font-bold mb-3">
            {language === 'uz'
              ? 'Sevimlilar Ro\'yxati Bo\'sh'
              : language === 'ru'
              ? 'Список Избранного Пуст'
              : 'Wishlist is Empty'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'uz'
              ? 'Hali sevimli mahsulotlaringiz yo\'q'
              : language === 'ru'
              ? 'У вас еще нет избранных товаров'
              : 'You haven\'t added any favorite products yet'}
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-['Montserrat'] text-3xl font-bold mb-2">
            {t('wishlist')}
          </h1>
          <p className="text-muted-foreground">
            {wishlist.length}{' '}
            {language === 'uz' ? 'mahsulot' : language === 'ru' ? 'товаров' : 'products'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50"
            >
              <Link
                to={`/product/${product.id}`}
                className="relative block aspect-square overflow-hidden bg-muted/20"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {product.discount && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                    -{product.discount}%
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-secondary text-white transition-all hover:scale-110"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </Link>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {product.brand}
                  </span>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="font-['Montserrat'] font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

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

                <button
                  onClick={() => {
                    addToCart(product);
                    toggleWishlist(product);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t('addToCart')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
