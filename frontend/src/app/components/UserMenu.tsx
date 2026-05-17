import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, LogOut, ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logoutUser, language } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const labels = {
    uz: { login: 'Kirish', orders: 'Buyurtmalarim', wishlist: 'Sevimlilar', profile: 'Profil', logout: 'Chiqish' },
    ru: { login: 'Войти', orders: 'Мои заказы', wishlist: 'Избранное', profile: 'Профиль', logout: 'Выйти' },
    en: { login: 'Sign In', orders: 'My Orders', wishlist: 'Wishlist', profile: 'Profile', logout: 'Sign Out' },
  };
  const l = labels[language] || labels.uz;

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
      >
        <User className="w-4 h-4" />
        <span className="hidden md:inline">{l.login}</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl hover:bg-accent/10 transition-colors"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
        )}
        <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="font-semibold text-sm text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link to="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors">
                <User className="w-4 h-4 text-secondary" />
                <span>{l.profile}</span>
              </Link>
              <Link to="/my-orders" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>{l.orders}</span>
              </Link>
              <Link to="/wishlist" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors">
                <Heart className="w-4 h-4 text-secondary" />
                <span>{l.wishlist}</span>
              </Link>
            </div>
            <div className="py-1 border-t border-border">
              <button
                onClick={() => { logoutUser(); setOpen(false); navigate('/'); }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{l.logout}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
