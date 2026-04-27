import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { 
  PackageOpen, MapPin, Phone, User as UserIcon, Search, 
  Eye, Clipboard, CheckCircle, Clock, Truck, XCircle, 
  MoreHorizontal, Download, Filter, ArrowUpRight, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface OrderData {
  _id: string;
  userId: { _id: string; name: string; email: string };
  items: OrderItem[];
  deliveryInfo: DeliveryInfo;
  paymentMethod: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/orders/all');
      setOrders(res.orders);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (err: any) {
      alert(`Xato: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (activeTab !== 'all') {
      result = result.filter(o => o.status === activeTab);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(o => 
        o._id.toLowerCase().includes(lower) || 
        o.deliveryInfo.name.toLowerCase().includes(lower) || 
        o.deliveryInfo.phone.includes(searchTerm)
      );
    }
    setFilteredOrders(result);
  }, [orders, activeTab, searchTerm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const generateReceipt = (order: OrderData) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(79, 70, 229); // Primary color
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('SOFIA SHOP', 105, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text('RASMIY SOTUV CHEKI', 105, 30, { align: 'center' });

      // Order Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Buyurtma ID: #${order._id.toUpperCase()}`, 20, 50);
      doc.text(`Sana: ${new Date(order.createdAt).toLocaleDateString('uz-UZ')} ${new Date(order.createdAt).toLocaleTimeString('uz-UZ')}`, 20, 57);
      doc.text(`Holat: ${order.status.toUpperCase()}`, 20, 64);

      // Customer Info
      doc.setFontSize(14);
      doc.text('MIJOZ MA\'LUMOTLARI', 20, 80);
      doc.setFontSize(10);
      doc.text(`Ism: ${order.deliveryInfo.name}`, 20, 87);
      doc.text(`Telefon: ${order.deliveryInfo.phone}`, 20, 94);
      doc.text(`Shahar: ${order.deliveryInfo.city}`, 20, 101);
      doc.text(`Manzil: ${order.deliveryInfo.address}`, 20, 108);

      // Items Table
      const tableData = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        formatPrice(item.price),
        formatPrice(item.price * item.quantity)
      ]);

      autoTable(doc, {
        startY: 120,
        head: [['Mahsulot', 'Soni', 'Narxi', 'Jami']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 9 }
      });

      // Total
      const finalY = (doc as any).lastAutoTable.finalY;
      doc.setFontSize(16);
      doc.text(`JAMI TO'LOV: ${formatPrice(order.total)}`, 190, finalY + 20, { align: 'right' });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Xaridingiz uchun rahmat!', 105, 280, { align: 'center' });
      doc.text('www.sofiashop.uz', 105, 285, { align: 'center' });

      doc.save(`Sofia_Shop_Check_${order._id.slice(-6)}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Chekni yaratishda xatolik yuz berdi. Iltimos, qaytadan urining.');
    }
  };

  const tabs = [
    { id: 'all', name: 'Barchasi', icon: Clipboard, color: 'text-primary' },
    { id: 'pending', name: 'Yangi', icon: Clock, color: 'text-yellow-500' },
    { id: 'processing', name: 'Tayyorlanmoqda', icon: PackageOpen, color: 'text-blue-500' },
    { id: 'shipped', name: 'Yo\'lda', icon: Truck, color: 'text-purple-500' },
    { id: 'delivered', name: 'Yetkazildi', icon: CheckCircle, color: 'text-green-500' },
    { id: 'cancelled', name: 'Bekor qilingan', icon: XCircle, color: 'text-red-500' },
  ];

  if (loading) {
     return <div className="p-12 text-center animate-pulse">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-['Montserrat']">Buyurtma Boshqaruvi</h1>
          <p className="text-muted-foreground mt-1">Sizga kelib tushayotgan barcha zakazlarni masofa orqali nazorat qiling.</p>
        </div>
        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md p-4 rounded-3xl border border-border/50">
           <div className="text-right">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Bugun jami</p>
              <p className="text-xl font-bold">{orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length} ta zakaz</p>
           </div>
           <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ArrowUpRight className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-card/60 backdrop-blur-md p-2 rounded-3xl border border-border/50 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                : 'hover:bg-accent/10 text-muted-foreground'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
            {tab.name}
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-accent/20'}`}>
               {tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Buyurtma ID, ism yoki telefon raqami bo'yicha qidiruv..."
          className="w-full pl-12 pr-4 py-4 bg-card/60 backdrop-blur-md border border-border/50 rounded-3xl focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={order._id}
              className="bg-card/60 backdrop-blur-md rounded-[32px] border border-border/50 p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                       #{order?._id?.slice(-6).toUpperCase()}
                     </span>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
                    order.status === 'processing' ? 'bg-blue-500/10 text-blue-600' :
                    order.status === 'shipped' ? 'bg-indigo-500/10 text-indigo-600' :
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {order.status === 'pending' ? 'Kutilmoqda' :
                     order.status === 'processing' ? 'Tayyorlanmoqda' :
                     order.status === 'shipped' ? 'Yo\'lda' :
                     order.status === 'delivered' ? 'Topshirildi' :
                     'Bekor qilindi'}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">{order.deliveryInfo?.name || 'Ismsiz mijoz'}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString('uz-UZ')} · {new Date(order.createdAt).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <div className="p-2 rounded-xl bg-accent/20"><Phone className="w-4 h-4 text-muted-foreground" /></div>
                    <p>{order.deliveryInfo?.phone || 'Telefon yo\'q'}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 rounded-xl bg-accent/20"><MapPin className="w-4 h-4 text-muted-foreground" /></div>
                    <p className="truncate line-clamp-1">{order.deliveryInfo?.city}, {order.deliveryInfo?.address}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Jami summa</p>
                   <p className="text-xl font-black text-primary italic">{formatPrice(order.total || 0)}</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-3.5 bg-accent/20 hover:bg-accent/30 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                   >
                     <Eye className="w-4 h-4" /> Tafsilot
                   </button>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       generateReceipt(order);
                     }}
                     className="p-3.5 bg-accent/20 hover:bg-primary hover:text-white rounded-2xl transition-all"
                     title="Chekni yuklab olish"
                   >
                     <Download className="w-4 h-4" />
                   </button>
                   <div className="relative group/actions flex-1">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="w-full py-3.5 bg-primary text-white rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-primary/30 transition-all font-black text-[10px] uppercase tracking-wider outline-none text-center appearance-none"
                      >
                         <option value="pending" className="text-black bg-white">🔄 Yangi</option>
                         <option value="processing" className="text-black bg-white">⚙️ Tayyorlash</option>
                         <option value="shipped" className="text-black bg-white">🚚 Yo'lda</option>
                         <option value="delivered" className="text-black bg-white">✅ Topshirish</option>
                         <option value="cancelled" className="text-black bg-white">❌ Bekor qilish</option>
                      </select>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" 
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
                       <h2 className="text-2xl font-black font-['Montserrat']">Buyurtma Tafsiloti</h2>
                       <p className="text-muted-foreground text-sm">ID: #{selectedOrder?._id?.toUpperCase()}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-accent/10 rounded-full">
                       <XCircle className="w-8 h-8 text-muted-foreground" />
                    </button>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                       <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Mijoz ma'lumotlari</h4>
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <UserIcon className="w-5 h-5 text-muted-foreground" />
                             <p className="font-bold">{selectedOrder.deliveryInfo.name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <Phone className="w-5 h-5 text-muted-foreground" />
                             <p className="font-bold">{selectedOrder.deliveryInfo.phone}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <MapPin className="w-5 h-5 text-muted-foreground" />
                             <p className="font-medium text-muted-foreground text-sm">{selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.address}</p>
                          </div>
                       </div>
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">To'lov & Holat</h4>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-muted-foreground">To'lov shakli</span>
                             <span className="font-bold uppercase">{selectedOrder.paymentMethod}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                             <span className="text-muted-foreground">Holat (Status)</span>
                             <span className="font-bold capitalize text-primary">{selectedOrder.status}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-accent/5 rounded-3xl p-6 border border-border/50">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Xaridlar ({selectedOrder.items.length})</h4>
                    <div className="space-y-4">
                       {selectedOrder.items.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-card border border-border overflow-hidden">
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                               <p className="font-bold text-sm">{item.name}</p>
                               <p className="text-xs text-muted-foreground">{item.quantity} dona x {formatPrice(item.price)}</p>
                            </div>
                            <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-accent/10 border-t border-border flex items-center justify-between">
                 <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Jami to'lov</p>
                    <p className="text-3xl font-black text-primary">{formatPrice(selectedOrder.total)}</p>
                 </div>
                 <button 
                    onClick={() => generateReceipt(selectedOrder)}
                    className="px-8 py-4 bg-primary text-white rounded-3xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Chekni yuklab olish
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredOrders.length === 0 && (
        <div className="bg-card/60 backdrop-blur-md p-20 text-center rounded-[40px] border border-border/50">
          <PackageOpen className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-20" />
          <h3 className="text-2xl font-black mb-2">Buyurtmalar topilmadi</h3>
          <p className="text-muted-foreground">Tanlangan filtr yoki qidiruv so'zi bo'yicha ma'lumot mavjud emas.</p>
        </div>
      )}
    </div>
  );
};

