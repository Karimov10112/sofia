import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, wishlist, language } = useStore();
  const t = useTranslation(language);

  const product = products.find(p => p.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedStorage, setSelectedStorage] = useState(product?.storage?.[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const images = product.images || [product.image];
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedStorage);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">{t('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${product.category}`} className="hover:text-primary capitalize">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-card border border-border mb-4"
            >
              <img
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === idx
                        ? 'border-primary scale-105'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-3">
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                {product.brand}
              </span>
            </div>

            <h1 className="font-['Montserrat'] text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} {t('reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-border">
              <span className="price text-4xl text-secondary">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="price text-xl text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                  {product.discount && (
                    <span className="px-3 py-1 bg-secondary/10 text-secondary font-semibold rounded-full text-sm">
                      -{product.discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block font-medium mb-3">{t('color')}</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${
                        selectedColor === color
                          ? 'border-primary scale-110 shadow-lg'
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.storage && product.storage.length > 0 && (
              <div className="mb-6">
                <label className="block font-medium mb-3">{t('storage')}</label>
                <div className="flex flex-wrap gap-3">
                  {product.storage.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                        selectedStorage === storage
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block font-medium mb-3">{t('quantity')}</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-primary/30"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('addToCart')}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  isWishlisted
                    ? 'border-secondary bg-secondary text-white'
                    : 'border-border hover:border-secondary hover:bg-secondary/10'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to="/checkout"
              onClick={handleAddToCart}
              className="block w-full py-4 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-semibold text-lg text-center transition-colors"
            >
              {t('buyNow')}
            </Link>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              {[
                { icon: Truck, text: t('freeDelivery') },
                { icon: Shield, text: t('warranty') },
                { icon: RotateCcw, text: t('returns') },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && (
          <div className="mb-16">
            <h2 className="font-['Montserrat'] text-2xl font-bold mb-6">
              {t('specifications')}
            </h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-muted/20' : ''}
                    >
                      <td className="px-6 py-4 font-medium w-1/3">{key}</td>
                      <td className="px-6 py-4 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="font-['Montserrat'] text-2xl font-bold mb-6">
            {t('reviewsTitle')}
          </h2>
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <p className="text-muted-foreground">
              {language === 'uz'
                ? 'Sharhlar tez orada qo\'shiladi'
                : language === 'ru'
                ? 'Отзывы скоро будут добавлены'
                : 'Reviews coming soon'}
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-['Montserrat'] text-2xl font-bold mb-6">
              {language === 'uz'
                ? 'O\'xshash Mahsulotlar'
                : language === 'ru'
                ? 'Похожие Товары'
                : 'Related Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
