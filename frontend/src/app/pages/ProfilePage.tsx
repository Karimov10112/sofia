import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { apiFetch } from '../utils/api';
import { 
  User, Mail, Phone, MapPin, Building, 
  Save, CheckCircle, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { user, loginUser, token } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      if (res.success && token) {
        loginUser(res.user, token);
        toast.success('Profil muvaffaqiyatli yangilandi!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-background to-accent/5">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl rounded-[40px] border border-border/50 shadow-2xl p-8 sm:p-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2">Profil Sozlamalari</h1>
            <p className="text-muted-foreground">Ma'lumotlaringizni to'ldiring, buyurtma berishda ular avtomatik tanlanadi.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">To'liq ism</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-14 pr-4 py-4 bg-accent/5 border border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold"
                  placeholder="Ismingizni kiriting"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Telefon raqam</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-14 pr-4 py-4 bg-accent/5 border border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold"
                  placeholder="+998 XX XXX XX XX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Shahar</label>
                <div className="relative group">
                  <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-14 pr-4 py-4 bg-accent/5 border border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-sm"
                    placeholder="Toshkent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Elektron pochta</label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-14 pr-4 py-4 bg-accent/5 border border-transparent rounded-2xl outline-none font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Doimiy manzil</label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full pl-14 pr-4 py-4 bg-accent/5 border border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all font-bold text-sm resize-none"
                  placeholder="Kvartira, uy raqami, ko'cha nomi..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Saqlash
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
