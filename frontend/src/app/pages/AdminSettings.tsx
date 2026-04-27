import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { apiFetch } from '../utils/api';
import { 
  User, Lock, Shield, Bell, Eye, EyeOff, Save, Key, 
  UserRound, Mail, Calendar, LogOut, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const { user, logoutUser, darkMode } = useStore();
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      toast.success('Profil ma\'lumotlari yangilandi');
      // In a real app, we would update the global user state here
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Yangi parollar bir-biriga mos kelmadi');
    }

    try {
      setLoading(true);
      await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      toast.success('Parol muvaffaqiyatli o\'zgartirildi');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-['Montserrat']">Sozlamalar</h1>
        <p className="text-muted-foreground mt-1">Hisobingiz ma'lumotlari va xavfsizlik sozlamalarini boshqaring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - SummaryCard */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-card/60 backdrop-blur-md p-8 rounded-[32px] border border-border/50 text-center shadow-sm">
              <div className="relative inline-block mb-4">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black shadow-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                 </div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-card rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                 </div>
              </div>
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{user?.role}</p>
              
              <div className="mt-8 pt-6 border-t border-border/50 space-y-4">
                 <div className="flex items-center gap-3 text-sm text-left">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{user?.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-left">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Qo'shildi: {new Date().toLocaleDateString()}</span>
                 </div>
              </div>

              <button 
                onClick={logoutUser}
                className="w-full mt-8 py-3.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                 <LogOut className="w-4 h-4" /> Chiqish
              </button>
           </div>

           <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                 <Shield className="w-5 h-5" />
                 <span className="text-sm font-bold">Xavfsizlik maslahati</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                 Hisobingizni himoya qilish uchun murakkab parollardan foydalaning va ularni hech kimga bermang.
              </p>
           </div>
        </div>

        {/* Right Content - Forms */}
        <div className="lg:col-span-2 space-y-8">
           {/* Profile Section */}
           <motion.div variants={itemVariants} className="bg-card/60 backdrop-blur-md p-8 rounded-[32px] border border-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <UserRound className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-bold">Profil ma'lumotlari</h2>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">To'liq ism</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input 
                         type="text"
                         className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                         value={profileData.name}
                         onChange={e => setProfileData({ name: e.target.value })}
                         placeholder="Ismingizni kiriting"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email (O'zgartirib bo'lmaydi)</label>
                    <div className="relative opacity-60">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input 
                         disabled
                         type="email"
                         className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border rounded-2xl cursor-not-allowed font-medium"
                         value={user?.email || ''}
                       />
                    </div>
                 </div>

                 <button 
                   disabled={loading}
                   className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                   <Save className="w-4 h-4" /> Saqlash
                 </button>
              </form>
           </motion.div>

           {/* Password Section */}
           <motion.div variants={itemVariants} className="bg-card/60 backdrop-blur-md p-8 rounded-[32px] border border-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                    <Lock className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-bold">Parolni yangilash</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Joriy parol</label>
                    <div className="relative">
                       <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input 
                         required
                         type={showCurrent ? 'text' : 'password'}
                         className="w-full pl-12 pr-12 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                         value={passwordData.currentPassword}
                         onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                         placeholder="••••••••"
                       />
                       <button 
                         type="button" 
                         onClick={() => setShowCurrent(!showCurrent)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                       >
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Yangi parol</label>
                       <div className="relative">
                          <input 
                            required
                            type={showNew ? 'text' : 'password'}
                            className="w-full px-5 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="••••••••"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                             {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Tasdiqlash</label>
                       <input 
                         required
                         type={showNew ? 'text' : 'password'}
                         className="w-full px-5 py-4 bg-accent/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                         value={passwordData.confirmPassword}
                         onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                         placeholder="••••••••"
                       />
                    </div>
                 </div>

                 <button 
                   disabled={loading}
                   className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                   <RefreshCw className="w-4 h-4" /> Parolni yangilash
                 </button>
              </form>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const RefreshCw: React.FC<{className?: string}> = ({className}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);
