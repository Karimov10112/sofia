import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useStore } from '../context/StoreContext';
import { 
  Shield, ShieldAlert, User as UserIcon, Search, Filter, Mail, 
  Calendar as CalendarIcon, MoreVertical, XCircle, RefreshCw, 
  UserPlus, MoreHorizontal, UserCheck, Trash2, Copy, ExternalLink, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

interface UserData {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  createdAt: string;
  avatar?: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const { user: currentUser } = useStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch('/admin/users');
      if (res.success) {
        setUsers(res.users || []);
        setFilteredUsers(res.users || []);
      } else {
        throw new Error(res.message || 'Xatolik yuz berdi');
      }
    } catch (err: any) {
      setError(err.message || 'Foydalanuvchilarni yuklashda xatolik');
      toast.error('Foydalanuvchilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(u => 
        (u.name?.toLowerCase() || '').includes(lower) || 
        (u.email?.toLowerCase() || '').includes(lower)
      );
    }
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const changeRole = async (targetUserId: string, newRole: string) => {
    if (!window.confirm(`Haqiqatan ham bu foydalanuvchiga ${newRole} darajasini bermoqchimisiz?`)) return;
    try {
      await apiFetch(`/admin/users/${targetUserId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      toast.success('Foydalanuvchi roli yangilandi');
      fetchUsers();
    } catch (err: any) {
      toast.error(`Xatolik: ${err.message}`);
    }
  };

  const handleDeleteUser = async (targetUserId: string) => {
    if (!window.confirm('Haqiqatan ham ushbu foydalanuvchini sistemadan butunlay o\'chirib tashlamoqchimisiz?')) return;
    try {
      await apiFetch(`/admin/users/${targetUserId}`, {
        method: 'DELETE',
      });
      toast.success('Foydalanuvchi muvaffaqiyatli o\'chirildi');
      fetchUsers();
    } catch (err: any) {
      toast.error(`Xatolik: ${err.message}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center bg-card/10 p-6 rounded-3xl border border-border/10">
           <div className="space-y-3">
              <div className="h-8 w-48 bg-accent/20 rounded-xl" />
              <div className="h-4 w-64 bg-accent/10 rounded-lg" />
           </div>
           <div className="h-12 w-40 bg-accent/20 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1,2,3].map(i => <div key={i} className="h-32 bg-card/60 border border-border/10 rounded-3xl" />)}
        </div>
        <div className="h-96 bg-card/60 border border-border/10 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-20 bg-card/60 backdrop-blur-md rounded-[40px] border border-red-500/10 text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-xl shadow-red-500/5">
           <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-2">Yuklashda xatolik</h2>
        <p className="text-muted-foreground max-w-sm mb-8">{error}</p>
        <button 
          onClick={fetchUsers}
          className="px-8 py-3.5 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          <RefreshCw className="w-4 h-4" /> Qayta urinish
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 pb-12">
      {/* Header & Stats Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-['Montserrat'] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Foydalanuvchilar</h1>
          <p className="text-muted-foreground mt-1">Hozirda sistemada {users.length} ta foydalanuvchi mavjud.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-card/60 backdrop-blur-md p-4 px-6 rounded-3xl border border-border/50 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Shield className="w-5 h-5" />
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase">Adminlar</p>
                 <p className="text-lg font-black">{users.filter(u => u.role !== 'user').length} ta</p>
              </div>
           </div>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-card/40 backdrop-blur-xl p-4 rounded-[32px] border border-border/50 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Ism, email yoki ID bo'yicha qidiruv..." 
            className="w-full pl-14 pr-4 py-4 bg-accent/5 hover:bg-accent/10 border border-transparent focus:border-primary/20 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <div className="relative min-w-[200px]">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select 
                className="w-full pl-14 pr-8 py-4 bg-accent/5 hover:bg-accent/10 border border-transparent focus:border-primary/20 rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none appearance-none font-bold cursor-pointer transition-all"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Barcha rollar</option>
                <option value="user">Foydalanuvchilar</option>
                <option value="admin">Adminlar</option>
                <option value="super_admin">Super Adminlar</option>
              </select>
           </div>
           <button className="p-4 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">
              <UserPlus className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card/40 backdrop-blur-xl rounded-[40px] border border-border/50 shadow-xl shadow-primary/5">
        <div className="overflow-visible scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-border/10">
                <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Foydalanuvchi</th>
                <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Kontakt & Link</th>
                <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">Rol (Daraja)</th>
                <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Vaqt</th>
                <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((u) => {
                  const uid = u._id || u.id;
                  const isSAdmin = u.role === 'super_admin';
                  const isAdmin = u.role === 'admin';
                  
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={uid as string} 
                      className="hover:bg-primary/[0.02] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                             <div className={`w-12 h-12 rounded-2xl ${isSAdmin ? 'bg-red-500/10 text-red-500' : isAdmin ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'} flex items-center justify-center font-black text-xl shadow-inner`}>
                               {u.name?.charAt(0).toUpperCase() || 'U'}
                             </div>
                             {isAdmin && (
                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-lg border-2 border-brand-bg flex items-center justify-center">
                                  <Shield className="w-3 h-3 text-white" />
                               </div>
                             )}
                             {isSAdmin && (
                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-lg border-2 border-brand-bg flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                  🌟
                               </div>
                             )}
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{u.name || 'Nomsiz User'}</span>
                             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">ID: #{(uid as string)?.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-sm font-medium">
                             <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                             {u.email}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-green-500">
                             <UserCheck className="w-3.5 h-3.5" />
                             Verified Account
                           </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider ${
                          isSAdmin ? 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20 shadow-sm shadow-red-500/5' :
                          isAdmin ? 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                          {(u.role || 'user').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col text-sm font-medium">
                           <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              {new Date(u.createdAt).toLocaleDateString()}
                           </div>
                           <span className="text-[10px] text-muted-foreground font-semibold ml-5">Ro'yxatdan o'tgan</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                           {currentUser?.role === 'super_admin' && (currentUser?.id || (currentUser as any)?._id) !== uid ? (
                             <>
                               <div className="relative overflow-hidden rounded-2xl border border-border/50 group/select">
                                  <select 
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-accent/5 hover:bg-accent/10 rounded-2xl text-xs font-bold focus:ring-0 outline-none cursor-pointer transition-all"
                                    value={u.role}
                                    onChange={(e) => changeRole(uid as string, e.target.value)}
                                  >
                                    <option value="user">👤 Foydalanuvchi</option>
                                    <option value="admin">⚙️ Admin</option>
                                    <option value="super_admin">👑 Super Admin</option>
                                  </select>
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover/select:translate-y-[-40%] transition-transform">
                                     <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                  </div>
                               </div>
                               <button 
                                 onClick={() => handleDeleteUser(uid as string)}
                                 className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                               >
                                  <Trash2 className="w-5 h-5" />
                               </button>
                             </>
                           ) : (
                              <div className="relative">
                                <button 
                                  onClick={() => setOpenMenuUserId(openMenuUserId === uid ? null : uid as string)}
                                  className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-2xl transition-all",
                                    openMenuUserId === uid ? "bg-primary text-white scale-110 shadow-lg" : "bg-accent/5 hover:bg-accent/10 text-muted-foreground opacity-0 group-hover:opacity-100"
                                  )}
                                >
                                   <MoreVertical className="w-5 h-5" />
                                </button>
                                
                                <AnimatePresence>
                                  {openMenuUserId === uid && (
                                    <>
                                      <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-[60]" onClick={() => setOpenMenuUserId(null)} 
                                      />
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10, x: 20 }}
                                        className="absolute right-0 top-full mt-3 w-64 bg-card/95 border border-border/50 rounded-[32px] shadow-2xl z-[70] p-3 backdrop-blur-2xl overflow-hidden ring-1 ring-primary/5"
                                      >
                                        <div className="px-4 py-2 mb-2 border-b border-border/10">
                                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profil Amallari</p>
                                        </div>
                                        <button 
                                          onClick={() => {
                                            if (uid === (currentUser?.id || (currentUser as any)?._id)) {
                                              window.location.href = '/admin/settings';
                                            } else {
                                              toast.info('Boshqa adminlarni tahrirlash cheklangan');
                                            }
                                            setOpenMenuUserId(null);
                                          }}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-2xl transition-all text-sm font-bold text-left group/item"
                                        >
                                           <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                              <UserCircle className="w-4 h-4" />
                                           </div>
                                           Profilga o'tish
                                        </button>
                                        <button 
                                          onClick={() => {
                                            navigator.clipboard.writeText(u.email);
                                            toast.success('Email nusxalandi');
                                            setOpenMenuUserId(null);
                                          }}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-500/10 rounded-2xl transition-all text-sm font-bold text-left group/item"
                                        >
                                           <div className="w-8 h-8 rounded-xl bg-green-500/5 flex items-center justify-center group-hover/item:bg-green-500 group-hover/item:text-white transition-colors text-green-600">
                                              <Copy className="w-4 h-4" />
                                           </div>
                                           Emailni nusxalash
                                        </button>
                                        <div className="mt-2 p-3 bg-accent/5 rounded-2xl text-[9px] font-bold text-muted-foreground break-all border border-border/5">
                                           ID: {uid as string}
                                        </div>
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>
                           )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-24 text-center">
              <div className="w-24 h-24 bg-accent/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                 <UserIcon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">Qidiruv bo'yicha hech narsa topilmadi</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">Tanlangan parametrlar bo'yicha ma'lumot mavjud emas. Iltimos, boshqa qidiruv so'zidan foydalaning.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
