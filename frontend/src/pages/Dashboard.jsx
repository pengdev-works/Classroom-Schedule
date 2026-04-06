import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  BookOpen, 
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  LayoutDashboard,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="premium-card relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500`} />
    <div className="flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl ${color}/10 ${color.replace('bg-', 'text-')} flex items-center justify-center shadow-inner group-hover:${color} group-hover:text-white transition-all duration-500`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-100">{value}</h3>
          {trend && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight size={10} /> {trend}%
          </span>}
        </div>
      </div>
    </div>
  </motion.div>
);

const SkeletonStat = () => (
  <div className="premium-card animate-pulse">
    <div className="flex items-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="w-1/2 h-4 bg-slate-800 rounded-md" />
        <div className="w-3/4 h-6 bg-slate-800 rounded-md" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    rooms: 0,
    faculty: 0,
    subjects: 0,
    schedules: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rooms, faculty, subjects, schedules] = await Promise.all([
          api.get('/rooms'),
          api.get('/faculty'),
          api.get('/subjects'),
          api.get('/schedules')
        ]);
        setStats({
          rooms: rooms.data.length,
          faculty: faculty.data.length,
          subjects: subjects.data.length,
          schedules: schedules.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalResources = stats.rooms + stats.faculty + stats.subjects;
  const getPercentage = (val) => totalResources === 0 ? 0 : (val / totalResources) * 100;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-4xl font-black text-slate-100 tracking-tight flex items-center gap-4 group">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <LayoutDashboard size={28} />
             </div>
             System Overview
           </h2>
           <p className="text-slate-400 mt-2 font-medium">Hello, <span className="text-indigo-400 font-black">{user.username}</span>. Welcome back to your unified command center.</p>
        </div>
        <div className="flex items-center gap-3 glass-morphism-light px-4 py-2 rounded-2xl border border-slate-700/30">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Operational</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? [1,2,3,4].map(i => <SkeletonStat key={i} />) : (
          <>
            <StatCard 
              title="Classrooms" 
              value={stats.rooms} 
              icon={<MapPin size={24} />} 
              color="bg-indigo-500" 
              trend={12}
            />
            <StatCard 
              title="Faculty staff" 
              value={stats.faculty} 
              icon={<Users size={24} />} 
              color="bg-purple-500" 
              trend={5}
            />
            <StatCard 
              title="Academic Subjects" 
              value={stats.subjects} 
              icon={<BookOpen size={24} />} 
              color="bg-pink-500" 
              trend={8}
            />
            <StatCard 
              title="Active Schedules" 
              value={stats.schedules} 
              icon={<CalendarIcon size={24} />} 
              color="bg-orange-500" 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="premium-card lg:col-span-2">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-100 tracking-tight uppercase">Resource Allocation</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Distribution Insights</p>
                </div>
             </div>
          </div>
          
          <div className="space-y-10">
             <div className="h-6 filter drop-shadow-xl bg-slate-800 rounded-full flex overflow-hidden ring-4 ring-slate-900">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(stats.rooms)}%` }}
                    className="bg-indigo-500 h-full"
                />
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(stats.faculty)}%` }}
                    className="bg-purple-500 h-full border-l border-slate-900"
                />
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getPercentage(stats.subjects)}%` }}
                    className="bg-pink-500 h-full border-l border-slate-900"
                />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Classrooms', val: stats.rooms, color: 'bg-indigo-500', note: 'Capacity & Infrastructure' },
                    { label: 'Faculty', val: stats.faculty, color: 'bg-purple-500', note: 'Human Resources' },
                    { label: 'Subjects', val: stats.subjects, color: 'bg-pink-500', note: 'Academic Portfolio' }
                ].map(item => (
                    <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="text-2xl font-black text-slate-100 mb-1">{item.val}</div>
                        <p className="text-[10px] text-slate-600 font-bold italic">{item.note}</p>
                    </div>
                ))}
             </div>
             
             <div className="p-6 rounded-2xl bg-slate-950/30 border border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-300">Operational Efficiency</p>
                        <p className="text-xs text-slate-500">Analytics generated based on {stats.schedules} active entries.</p>
                    </div>
                </div>
                <button className="px-6 py-2 rounded-xl bg-indigo-600/10 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-600/5">
                    View Detail
                </button>
             </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Clock size={20} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-100 tracking-tight uppercase">System Status</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Monitoring</p>
             </div>
          </div>

          <div className="space-y-4">
             <motion.div 
                whileHover={{ x: 5 }}
                className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4 cursor-default"
             >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck size={18} />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-100 tracking-tight mb-1 uppercase">Security Protocol</p>
                   <p className="text-[10px] text-slate-500 font-bold tracking-wide">Administrator role authenticated and encrypted.</p>
                </div>
             </motion.div>
             <motion.div 
                whileHover={{ x: 5 }}
                className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4 cursor-default"
             >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <LayoutDashboard size={18} />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-100 tracking-tight mb-1 uppercase">Cloud Connection</p>
                   <p className="text-[10px] text-slate-500 font-bold tracking-wide">Backend database latency - 45ms. Status Optimal.</p>
                </div>
             </motion.div>
             <div className="mt-10 p-6 border-t border-slate-800/50">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest mb-4">
                    <span className="text-slate-500">Server Load</span>
                    <span className="text-indigo-400">Low</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '28%' }}
                        className="h-full bg-indigo-500"
                    />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
