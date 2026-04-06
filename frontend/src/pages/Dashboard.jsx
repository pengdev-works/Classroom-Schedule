import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  BookOpen, 
  Calendar as CalendarIcon,
  TrendingUp,
  Clock
} from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ title, value, icon, color }) => (
  <div className="premium-card flex items-center gap-6">
    <div className={`p-4 rounded-2xl ${color}/20 text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
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
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Classrooms" 
          value={stats.rooms} 
          icon={<MapPin size={24} />} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Total Faculty" 
          value={stats.faculty} 
          icon={<Users size={24} />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Active Subjects" 
          value={stats.subjects} 
          icon={<BookOpen size={24} />} 
          color="bg-pink-500" 
        />
        <StatCard 
          title="Total Schedules" 
          value={stats.schedules} 
          icon={<CalendarIcon size={24} />} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold flex items-center gap-2">
               <TrendingUp size={20} className="text-indigo-400" />
               Overview
             </h3>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
             <p className="text-slate-500 italic">Faculty workload and room usage analytics will appear here.</p>
          </div>
        </div>

        <div className="premium-card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-purple-400" />
            Recent Conflict Alerts
          </h3>
          <div className="space-y-4">
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-slate-300">No conflicts found in current schedule.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
