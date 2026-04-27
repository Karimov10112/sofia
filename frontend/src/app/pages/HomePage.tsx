import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { language } = useStore();
  const t = useTranslation(language);

  const bestsellers = products.filter(p => p.isBestseller).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Collection 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-['Montserrat'] text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Sofia Beauty & Tech
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-white/90"
            >
              {language === 'uz'
                ? 'Go\'zallik va texnologiya mahsulotlari uchun eng yaxshi tanlov'
                : language === 'ru'
                ? 'Лучший выбор косметики и технологий'
                : 'Your premium destination for beauty and technology'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/category/beauty"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
              >
                {t('shopNow')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-['Montserrat'] text-3xl font-bold mb-2">
                {t('categories')}
              </h2>
              <p className="text-muted-foreground">
                {language === 'uz'
                  ? 'Mahsulot kategoriyalarini ko\'ring'
                  : language === 'ru'
                  ? 'Просмотрите категории товаров'
                  : 'Browse product categories'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="group relative block h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="font-['Montserrat'] text-3xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {category.count} {language === 'uz' ? 'mahsulot' : language === 'ru' ? 'товаров' : 'products'}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-medium">
                      {t('viewAll')}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['Montserrat'] text-3xl font-bold mb-3">
              {t('bestsellers')}
            </h2>
            <p className="text-muted-foreground">
              {language === 'uz'
                ? 'Eng mashhur mahsulotlar'
                : language === 'ru'
                ? 'Самые популярные товары'
                : 'Most popular products'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product, idx) => (
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

          <div className="text-center mt-12">
            <Link
              to="/category/beauty"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              {t('viewAll')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: t('freeDelivery'),
                description: t('freeDeliveryDesc'),
              },
              {
                icon: Shield,
                title: t('warranty'),
                description: t('warrantyDesc'),
              },
              {
                icon: RotateCcw,
                title: t('returns'),
                description: t('returnsDesc'),
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-6 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Montserrat'] font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Montserrat'] text-3xl md:text-4xl font-bold text-white mb-4">
              {t('newsletter')}
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              {t('newsletterDesc')}
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('enterEmail')}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                {t('subscribe')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
