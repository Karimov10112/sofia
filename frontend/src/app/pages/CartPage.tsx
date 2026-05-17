import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, language } = useStore();
  const t = useTranslation(language);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-primary" />
          </div>
          <h2 className="font-['Montserrat'] text-2xl font-bold mb-3">
            {t('emptyCart')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'uz'
              ? 'Savatingizda hozircha mahsulot yo\'q'
              : language === 'ru'
              ? 'В вашей корзине пока нет товаров'
              : 'Your cart is empty right now'}
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
        <h1 className="font-['Montserrat'] text-3xl font-bold mb-8">{t('cart')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <motion.div
                key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-lg"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    to={`/product/${item.id}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-muted/20 flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4 mb-2">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-['Montserrat'] font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {item.brand}
                    </p>

                    {/* Variants */}
                    {(item.selectedColor || item.selectedStorage) && (
                      <div className="flex gap-4 mb-3 text-sm">
                        {item.selectedColor && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{t('color')}:</span>
                            <div
                              className="w-5 h-5 rounded-full border border-border"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                        )}
                        {item.selectedStorage && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{t('storage')}:</span>
                            <span className="font-medium">{item.selectedStorage}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-md hover:bg-primary/10 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md hover:bg-primary/10 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="price text-xl font-semibold text-secondary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="price text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg sticky top-24">
              <h2 className="font-['Montserrat'] text-xl font-bold mb-6">
                {t('orderSummary')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span className="price font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('shipping')}</span>
                  <span className="price font-semibold text-green-600">
                    {language === 'uz' ? 'Bepul' : language === 'ru' ? 'Бесплатно' : 'Free'}
                  </span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">{t('total')}</span>
                    <span className="price text-2xl font-bold text-secondary">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all mb-4"
              >
                {t('checkout')}
              </Link>

              <Link
                to="/"
                className="block w-full py-3 border-2 border-border rounded-xl font-medium text-center hover:bg-accent/10 transition-colors"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
