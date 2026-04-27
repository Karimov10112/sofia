import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Menu,
  Bell,
  Search
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/translations';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout: React.FC = () => {
  const { user, logoutUser, language, darkMode } = useStore();
  const t = useTranslation(language);
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) return;

    const socket = io('http://localhost:5002', { withCredentials: true });

    socket.on('connect', () => {
      socket.emit('joinAdmin');
    });

    socket.on('newOrder', (data: any) => {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});

      toast.success(data.message || 'Yangi buyurtma qabul qilindi!', {
        description: `Summa: ${new Intl.NumberFormat('uz-UZ').format(data.order.total)} so'm`,
        duration: 10000,
        action: {
          label: 'Ko\'rish',
          onClick: () => window.location.href = '/admin/orders'
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users, roles: ['super_admin', 'admin'] },
    { name: 'Mahsulotlar', href: '/admin/products', icon: Package },
    { name: 'Buyurtmalar', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Sozlamalar', href: '/admin/settings', icon: Settings },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className={cn("min-h-screen bg-brand-bg flex overflow-hidden selection:bg-primary/20", darkMode && "dark")}>
      {/* Sidebar Overlay for mobile */}
      {!isSidebarOpen && (
        <div className="md:hidden absolute inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(true)} />
      )}

      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "bg-card/40 backdrop-blur-xl border-r border-primary/5 flex flex-col z-50 relative",
        )}
      >
        <div className="p-8 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div 
                key="logo-full"
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-3 group cursor-pointer hover:rotate-0 transition-transform">
                  <span className="text-white font-black italic text-xl">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tighter leading-none">Sofia</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Admin Panel</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="logo-mini"
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mx-auto"
              >
                 <span className="text-white font-black">S</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 scrollbar-hide overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-all group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-sm tracking-tight"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-white rounded-r-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-primary/5 space-y-4">
          <div className={cn("flex items-center gap-3 p-2 rounded-2xl bg-accent/5", !isSidebarOpen && "justify-center")}>
            <Avatar className="h-10 w-10 border-2 border-primary/20 ring-4 ring-primary/5">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black truncate">{user?.name}</span>
                <div className="flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{user?.role?.replace('_', ' ')}</span>
                </div>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            className={cn("w-full h-12 rounded-2xl justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all font-bold", !isSidebarOpen && "px-0 justify-center")}
            onClick={logoutUser}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3">Tizimdan chiqish</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background blobs for depth */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full -z-10" />

        {/* Header */}
        <header className="h-20 border-b border-primary/5 bg-card/10 backdrop-blur-xl px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
             <Button variant="ghost" size="icon" className="hidden md:flex rounded-xl hover:bg-primary/5" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <Menu className="h-5 w-5 text-primary" />
             </Button>
             <div className="relative max-w-md w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Global qidiruv..." 
                  className="w-full pl-12 pr-4 py-3 bg-accent/10 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:bg-primary/5">
                 <Bell className="h-5 w-5 text-muted-foreground" />
                 <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-brand-bg shadow-sm" />
               </Button>
               <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-primary/5 flex md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                  <Menu className="h-5 w-5" />
               </Button>
            </div>
            <div className="h-8 w-px bg-primary/10 mx-2" />
            <Button variant="default" size="lg" className="rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
              <Link to="/">Do'konga o'tish</Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-12 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
