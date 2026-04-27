import React, { useState } from 'react';
import { Link } from 'react-router';
import { Search, ShoppingCart, Heart, User, Moon, Sun, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { products } from '../data/products';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, language, setLanguage, darkMode, toggleDarkMode, user, logoutUser } = useStore();
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const searchResults = searchQuery.length > 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-['Montserrat'] text-xl font-bold text-white">S</span>
            </div>
            <span className="font-['Montserrat'] text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sofia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link to="/category/beauty" className="text-foreground hover:text-primary transition-colors">
              {t('beauty')}
            </Link>
            <Link to="/category/smartphone" className="text-foreground hover:text-primary transition-colors">
              {t('smartphones')}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full px-4 py-2 pl-10 rounded-2xl bg-input-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Search Suggestions */}
              {showSearchResults && searchResults.length > 0 && (
                <div
                  className="absolute top-full mt-2 w-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
                >
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors"
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-muted/30 rounded-full p-1">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:flex p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => user ? setProfileMenuOpen(!profileMenuOpen) : window.location.href = '/login'}
                className="hidden md:flex p-2 rounded-full hover:bg-accent/10 transition-colors"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>

                {profileMenuOpen && user && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-card rounded-2xl shadow-xl border border-border py-2"
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-orders"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10"
                    >
                      {language === 'uz' ? 'Mening buyurtmalarim' : language === 'ru' ? 'Мои заказы' : 'My Orders'}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10"
                    >
                      {language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'}
                    </Link>
                    {user.role !== 'user' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10"
                      >
                        {language === 'uz' ? 'Admin Panel' : 'Admin Panel'}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logoutUser();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                    >
                      {language === 'uz' ? 'Chiqish' : language === 'ru' ? 'Выйти' : 'Logout'}
                    </button>
                  </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-2xl bg-input-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-border bg-card"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary"
              >
                {t('home')}
              </Link>
              <Link
                to="/category/beauty"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary"
              >
                {t('beauty')}
              </Link>
              <Link
                to="/category/smartphone"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary"
              >
                {t('smartphones')}
              </Link>
              {user && (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-foreground hover:text-primary font-bold"
                  >
                    {language === 'uz' ? 'Mening buyurtmalarim' : language === 'ru' ? 'Мои заказы' : 'My Orders'}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-foreground hover:text-primary font-bold"
                  >
                    {language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'}
                  </Link>
                </>
              )}

              {/* Language Switcher Mobile */}
              <div className="flex items-center gap-2 py-2">
                {(['uz', 'ru', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      language === lang
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Dark Mode Toggle Mobile */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 py-2"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        )}

      {/* Click outside to close menus */}
      {(showSearchResults || profileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSearchResults(false);
            setProfileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};
