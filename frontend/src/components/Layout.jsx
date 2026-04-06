import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  BookOpen, 
  Layers, 
  Calendar, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const allNavItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Rooms', path: '/rooms', icon: <MapPin size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Faculty', path: '/faculty', icon: <Users size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Sections', path: '/sections', icon: <Layers size={20} />, roles: ['admin', 'teacher'] },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
  ];

  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(user.role));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/50 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h2 className="text-2xl font-bold gradient-text">UA Schedule</h2>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="glass-morphism p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0" />
               <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-slate-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-md bg-slate-900/50">
           <h1 className="text-xl font-semibold text-slate-200">
             Management System
           </h1>
           <div className="flex items-center gap-4">
              <div className="p-2 glass-morphism text-slate-400">
                 <Calendar size={20} />
              </div>
              <span className="text-sm text-slate-400 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
           </div>
        </header>
        
        <div className="p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
