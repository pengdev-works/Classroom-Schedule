import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  BookOpen,
  Layers,
  Calendar as CalendarIcon,
  LogOut,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import uaLogo from '../assets/ua_logo.jpg';
import cmcsLogo from '../assets/cmcs_logo.jpg';

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const allNavItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Rooms', path: '/rooms', icon: <MapPin size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Faculty', path: '/faculty', icon: <Users size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Sections', path: '/sections', icon: <Layers size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Schedule', path: '/schedule', icon: <CalendarIcon size={20} /> },
  ];

  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(user.role));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col sticky top-0 h-screen z-20">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center -space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg ring-2 ring-slate-800/50 z-10 overflow-hidden">
                <img src={uaLogo} alt="UA" className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg ring-2 ring-slate-800/50 overflow-hidden">
                <img src={cmcsLogo} alt="CMCS" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black gradient-text tracking-tighter uppercase italic">UA</h2>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">University of Abra</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2 custom-scrollbar overflow-y-auto">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
                ${isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-600/5'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4">
                    <span className="transition-transform group-hover:scale-110 duration-300">
                      {item.icon}
                    </span>
                    <span className="font-bold text-sm tracking-wide">{item.name}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <div className="glass-morphism-light p-4 flex items-center justify-between group">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-black text-lg shadow-inner">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-100 truncate">{user.username}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 text-slate-500 hover:shadow-lg hover:shadow-red-500/5"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative flex flex-col">
        <header className="h-24 border-b border-slate-800/50 flex items-center justify-between px-12 sticky top-0 z-10 backdrop-blur-xl bg-slate-900/40">
          <div>
            <h1 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">
              Classroom Schedule Management
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Clock size={12} className="text-indigo-400" />
              Live Monitoring System
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm text-slate-200 font-black tracking-tight">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="w-[1px] h-10 bg-slate-800/50 hidden md:block" />
            <div className="p-3 rounded-2xl glass-morphism-light text-indigo-400 animate-pulse">
              <CalendarIcon size={20} />
            </div>
          </div>
        </header>

        <div className="p-12 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
