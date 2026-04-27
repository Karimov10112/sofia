import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { products, brands } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Slider } from '../components/ui/slider';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { language } = useStore();
  const t = useTranslation(language);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'newest'>('popular');

  const categoryProducts = products.filter(p => p.category === category);

  const maxPrice = Math.max(...categoryProducts.map(p => p.price));

  const filteredProducts = useMemo(() => {
    let filtered = categoryProducts;

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    // Sorting
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return filtered;
  }, [categoryProducts, selectedBrands, priceRange, selectedRating, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const categoryBrands = Array.from(new Set(categoryProducts.map(p => p.brand)));

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Montserrat'] text-3xl font-bold mb-2 capitalize">
            {category === 'beauty' ? t('beauty') : t('smartphones')}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {language === 'uz' ? 'mahsulot topildi' : language === 'ru' ? 'товаров найдено' : 'products found'}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Montserrat'] font-semibold text-lg">{t('filters')}</h3>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange([0, maxPrice]);
                    setSelectedRating(0);
                  }}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear All
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6 pb-6 border-b border-border">
                <h4 className="font-medium mb-3">{t('brand')}</h4>
                <div className="space-y-2">
                  {categoryBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6 pb-6 border-b border-border">
                <h4 className="font-medium mb-3">{t('priceRange')}</h4>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={maxPrice}
                    step={100000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="price text-muted-foreground">
                      {formatPrice(priceRange[0])}
                    </span>
                    <span className="price text-muted-foreground">
                      {formatPrice(priceRange[1])}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('rating')}</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedRating === rating
                          ? 'bg-primary/10 text-primary border border-primary'
                          : 'hover:bg-accent/10'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm">& up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort & Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:bg-accent/10 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t('filters')}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:border-primary ml-auto"
              >
                <option value="popular">{t('popular')}</option>
                <option value="priceLow">{t('priceLowHigh')}</option>
                <option value="priceHigh">{t('priceHighLow')}</option>
                <option value="newest">{t('newest')}</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  {language === 'uz'
                    ? 'Mahsulot topilmadi'
                    : language === 'ru'
                    ? 'Товары не найдены'
                    : 'No products found'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-card p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Montserrat'] font-semibold text-lg">{t('filters')}</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Same filters as desktop */}
            <div className="space-y-6">
              {/* Brand Filter */}
              <div>
                <h4 className="font-medium mb-3">{t('brand')}</h4>
                <div className="space-y-2">
                  {categoryBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3">{t('priceRange')}</h4>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={100000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span className="price">{formatPrice(priceRange[0])}</span>
                  <span className="price">{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium mb-3">{t('rating')}</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => {
                        setSelectedRating(rating);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        selectedRating === rating ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                      <span className="ml-2">& up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
