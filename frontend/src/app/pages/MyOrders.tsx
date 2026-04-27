import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { apiFetch } from '../utils/api';
import { 
  Package, Truck, CheckCircle, Clock, XCircle, 
  MapPin, Phone, Calendar, ShoppingBag, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  _id: string;
  items: OrderItem[];
  deliveryInfo: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export const MyOrders: React.FC = () => {
  const { user } = useStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/orders');
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const getStatusInfo = (status: OrderData['status']) => {
    switch (status) {
      case 'pending': return { label: 'Kutilmoqda', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock };
      case 'processing': return { label: 'Tayyorlanmoqda', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Package };
      case 'shipped': return { label: 'Yo\'lda', color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Truck };
      case 'delivered': return { label: 'Topshirildi', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle };
      case 'cancelled': return { label: 'Bekor qilingan', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
      default: return { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: Package };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-muted-foreground animate-pulse">Buyurtmalar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2">Mening Buyurtmalarim</h1>
          <p className="text-muted-foreground font-medium">Barcha xaridlaringiz va ularning holatini bu yerdan kuzatib boring.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card/40 backdrop-blur-xl rounded-[40px] border border-border/50">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Sizda hali buyurtmalar yo'q</h3>
            <p className="text-muted-foreground mb-8">Sofia Shop-dan o'zingizga yoqqan mahsulotlarni xarid qiling!</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              Xaridni boshlash <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const status = getStatusInfo(order.status);
                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-border/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${status.bg} ${status.color}`}>
                            <status.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Buyurtma holati</p>
                            <p className={`font-black uppercase tracking-wider ${status.color}`}>{status.label}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">ID: #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="font-bold flex items-center gap-2 justify-end">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mahsulotlar</h4>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-background border border-border/50 overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.quantity} dona × {formatPrice(item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Yetkazib berish</h4>
                          <div className="p-4 rounded-2xl bg-accent/5 space-y-3 border border-border/5">
                            <div className="flex items-center gap-3 text-sm font-semibold">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <p>{order.deliveryInfo.city}, {order.deliveryInfo.address}</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p>{order.deliveryInfo.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border/10 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Jami to'lov</p>
                          <p className="text-2xl font-black text-primary italic">{formatPrice(order.total)}</p>
                        </div>
                        <div className="flex gap-3">
                          {['pending', 'processing'].includes(order.status) && (
                            <button 
                              onClick={async () => {
                                if (!window.confirm('Haqiqatan ham ushbu buyurtmani bekor qilmoqchimisiz?')) return;
                                try {
                                  await apiFetch(`/orders/${order._id}/cancel`, { method: 'PUT' });
                                  const res = await apiFetch('/orders');
                                  setOrders(res.orders || []);
                                } catch (err) {
                                  alert('Xatolik yuz berdi');
                                }
                              }}
                              className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                              Bekor qilish
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-6 py-3 bg-accent/10 hover:bg-accent/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                          >
                            Tafsilotlar
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card rounded-[40px] border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 overflow-y-auto">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <h2 className="text-2xl font-black">Buyurtma Tafsiloti</h2>
                       <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">ID: #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                       <XCircle className="w-8 h-8 text-muted-foreground" />
                    </button>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                       <div>
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Yetkazib berish</h4>
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary"><MapPin className="w-4 h-4" /></div>
                                <p className="text-sm font-bold">{selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.address}</p>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary"><Phone className="w-4 h-4" /></div>
                                <p className="text-sm font-bold">{selectedOrder.deliveryInfo.phone}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Buyurtma holati</h4>
                       <div className="p-6 rounded-3xl bg-accent/5 border border-border/50">
                          <div className="flex items-center justify-between mb-4">
                             <span className="text-xs font-bold text-muted-foreground">Sana</span>
                             <span className="text-sm font-black">{new Date(selectedOrder.createdAt).toLocaleDateString('uz-UZ')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-muted-foreground">Holat</span>
                             <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">
                                {getStatusInfo(selectedOrder.status).label}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-accent/5 rounded-[32px] p-6 border border-border/50">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 text-center">Xarid qilingan mahsulotlar</h4>
                    <div className="space-y-4">
                       {selectedOrder.items.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-card/50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 overflow-hidden flex-shrink-0">
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-sm truncate">{item.name}</p>
                               <p className="text-xs text-muted-foreground">{item.quantity} dona x {formatPrice(item.price)}</p>
                            </div>
                            <p className="font-black text-sm text-primary italic">{formatPrice(item.price * item.quantity)}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-accent/5 border-t border-border/50 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Jami to'lov</p>
                    <p className="text-3xl font-black text-primary italic">{formatPrice(selectedOrder.total)}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedOrder(null)}
                   className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                 >
                    Yopish
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
