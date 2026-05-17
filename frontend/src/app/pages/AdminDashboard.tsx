import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { apiFetch } from '../utils/api';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user, darkMode } = useStore();
  const [statsData, setStatsData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          apiFetch('/admin/stats'),
          apiFetch('/admin/analytics')
        ]);
        setStatsData(statsRes.stats);
        setAnalytics(analyticsRes.analytics);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const statsList = [
    { 
      name: 'Umumiy Tushum', 
      value: statsData ? formatPrice(statsData.totalRevenue) : '0 so\'m', 
      icon: DollarSign, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10',
      trend: '+12.5%',
      isPositive: true
    },
    { 
      name: 'Bugungi Buyurtmalar', 
      value: statsData ? statsData.orderCount.toString() : '0', 
      icon: ShoppingCart, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: '+4.2%',
      isPositive: true
    },
    { 
      name: 'Foydalanuvchilar', 
      value: statsData ? statsData.userCount.toString() : '0', 
      icon: Users, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10',
      trend: '+2.1%',
      isPositive: true
    },
    { 
      name: 'Aktiv Mahsulotlar', 
      value: statsData ? statsData.productCount.toString() : '0', 
      icon: Package, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10',
      trend: '-1.4%',
      isPositive: false
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-accent/20 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card rounded-2xl border border-border" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="h-80 bg-card rounded-2xl border border-border" />
           <div className="h-80 bg-card rounded-2xl border border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-['Montserrat'] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Boshqaruv Paneli
          </h1>
          <p className="text-muted-foreground mt-1">Sizning biznesingizdagi so'nggi yangiliklar va statistikalar.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-xl shadow-sm">
           <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">Haftalik</button>
           <button className="px-4 py-1.5 hover:bg-accent/10 rounded-lg text-sm font-medium transition-colors">Oylik</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, idx) => (
          <div key={idx} className="group bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'} bg-opacity-10 px-2 py-1 rounded-full`}>
                {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Haftalik Tushum
            </h3>
            <span className="text-xs font-semibold text-muted-foreground bg-accent/10 px-2 py-1 rounded-md">Last 7 Days</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} 
                  tickFormatter={(val) => (typeof val === 'string' ? val.split('-').slice(1).join('/') : val)}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: 'var(--card)'}}
                  formatter={(value: any) => [formatPrice(value), 'Tushum']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-card/60 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-secondary" />
              Buyurtmalar Soni
            </h3>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: 'var(--muted-foreground)'}} 
                  tickFormatter={(val) => (typeof val === 'string' ? val.split('-').slice(1).join('/') : val)}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: 'var(--card)'}}
                />
                <Bar dataKey="orders" fill="var(--secondary)" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

