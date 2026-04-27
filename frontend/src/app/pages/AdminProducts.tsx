import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { 
  Plus, Search, Edit2, Trash2, Package, Filter, 
  ChevronRight, MoreHorizontal, ExternalLink, RefreshCw,
  Image as ImageIcon, DollarSign, Tag, Layers, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  stock: number;
  image: string;
  description: string;
  isBestseller: boolean;
  isLatest: boolean;
}

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: 'beauty',
    brand: '',
    image: '',
    stock: 0,
    isBestseller: false,
    isLatest: true
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/products?limit=100`);
      setProducts(res.products);
    } catch (err: any) {
      toast.error('Mahsulotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatdan ham ushbu mahsulotni o\'chirmoqchimisiz?')) return;
    try {
      const pid = id || (id === undefined ? '' : id); // Already passed as arg, but let's be safe
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      toast.success('Mahsulot o\'chirildi');
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock,
      isBestseller: product.isBestseller,
      isLatest: product.isLatest
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const endpoint = editingProduct ? `/products/${editingProduct._id || (editingProduct as any).id}` : '/products';
      
      await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      });
      
      toast.success(editingProduct ? 'Mahsulot yangilandi' : 'Yangi mahsulot qo\'shildi');
      setIsFormOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'beauty', 'smartphone', 'electronics', 'fashion', 'home'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-['Montserrat']">Mahsulotlar Ombori</h1>
          <p className="text-muted-foreground mt-1">Do'kondagi barcha mahsulotlarni boshqarish, qo'shish va tahrirlash.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({
               name: '', description: '', price: 0, originalPrice: 0, 
               category: 'beauty', brand: '', image: '', stock: 0, 
               isBestseller: false, isLatest: true
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" /> Yangi Mahsulot
        </button>
      </div>

      {/* Stats Mini Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Package className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs text-muted-foreground font-bold uppercase">Jami mahsulot</p>
               <p className="text-xl font-black">{products.length} ta</p>
            </div>
         </div>
         <div className="bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
               <Layers className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs text-muted-foreground font-bold uppercase">Kategoriyalar</p>
               <p className="text-xl font-black">{new Set(products.map(p => p.category)).size} ta</p>
            </div>
         </div>
         <div className="bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
               <RefreshCw className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs text-muted-foreground font-bold uppercase">Zaxirada kam</p>
               <p className="text-xl font-black">{products.filter(p => p.stock < 10).length} ta</p>
            </div>
         </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Mahsulot nomi yoki brendi bo'yicha qidiruv..."
            className="w-full pl-12 pr-4 py-4 bg-card/60 backdrop-blur-md border border-border/50 rounded-3xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-card/60 backdrop-blur-md p-1.5 rounded-3xl border border-border/50 overflow-x-auto max-w-full scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                selectedCategory === cat ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-accent/10'
              }`}
            >
              {cat === 'all' ? 'Barchasi' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card/60 backdrop-blur-md rounded-[32px] border border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Mahsulot</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Kategoriya</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Narxi</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Zaxira</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Holat</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProducts.map((product) => (
                <tr key={product._id || (product as any).id} className="hover:bg-accent/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl border border-border/50 overflow-hidden bg-white flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-accent/10 rounded-lg text-[10px] font-bold uppercase text-muted-foreground">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-sm">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                       <span className={`text-sm font-bold ${product.stock <= 10 ? 'text-red-500' : ''}`}>{product.stock} dona</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-1.5">
                       {product.isBestseller && <span className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-[10px]" title="Bestseller">🔥</span>}
                       {product.isLatest && <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px]" title="New">✨</span>}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2.5 bg-accent/10 hover:bg-primary/20 hover:text-primary rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-12 text-center text-muted-foreground animate-pulse font-bold">Yuklanmoqda...</div>}
          {!loading && filteredProducts.length === 0 && (
            <div className="p-20 text-center">
               <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
               <p className="text-muted-foreground font-bold">Mahsulotlar topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal (Slide-over style) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col"
            >
               <div className="p-8 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black font-['Montserrat']">
                       {editingProduct ? 'Tahrirlash' : 'Yangi Mahsulot'}
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                       {editingProduct ? `ID: #${(editingProduct?._id || (editingProduct as any)?.id)?.slice?.(-6)?.toUpperCase()}` : 'Ma\'lumotlarni kiriting'}
                    </p>
                  </div>
                  <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-accent/10 rounded-full">
                     <X className="w-8 h-8 text-muted-foreground" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Mahsulot nomi</label>
                     <input 
                        required
                        className="w-full px-5 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Masalan: iPhone 16 Pro Max"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Brend</label>
                       <div className="relative">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            required
                            className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            value={formData.brand}
                            onChange={e => setFormData({...formData, brand: e.target.value})}
                            placeholder="Apple"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Kategoriya</label>
                       <select 
                        className="w-full px-5 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                       >
                          {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Narxi (so'm)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            required type="number"
                            className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Zaxira (stock)</label>
                       <div className="relative">
                          <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            required type="number"
                            className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            value={formData.stock}
                            onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Rasm URL</label>
                     <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          required
                          className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                          value={formData.image}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                          placeholder="https://..."
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Tavsif (Description)</label>
                     <textarea 
                        required rows={3}
                        className="w-full px-5 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Mahsulot haqida batafsil ma'lumot..."
                     />
                  </div>

                  <div className="flex gap-8 py-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                           type="checkbox" 
                           className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary"
                           checked={formData.isBestseller}
                           onChange={e => setFormData({...formData, isBestseller: e.target.checked})}
                        />
                        <span className="text-sm font-bold">Bestseller 🔥</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                           type="checkbox" 
                           className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary"
                           checked={formData.isLatest}
                           onChange={e => setFormData({...formData, isLatest: e.target.checked})}
                        />
                        <span className="text-sm font-bold">Yangi Kelgan ✨</span>
                     </label>
                  </div>
               </form>

               <div className="p-8 border-t border-border bg-accent/5 flex gap-4">
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-4 border border-border rounded-2xl font-bold hover:bg-card transition-colors"
                  >
                     Bekor qilish
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                     {editingProduct ? 'Yangilash' : 'Saqlash'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
