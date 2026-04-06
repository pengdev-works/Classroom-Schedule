import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';
import uaLogo from '../assets/ua_logo.jpg';
import cmcsLogo from '../assets/cmcs_logo.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `Logged in as ${response.data.user.fullName}`,
        background: '#1e293b',
        color: '#f1f5f9',
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: error.response?.data?.message || 'Invalid credentials',
        background: '#1e293b',
        color: '#f1f5f9',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative overflow-hidden bg-slate-950">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/50 rounded-full blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="premium-card w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border-indigo-500/20 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.div
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-indigo-500/20 bg-white p-1"
            >
              <img src={uaLogo} alt="UA Logo" className="w-full h-full object-contain" />
            </motion.div>
            <div className="w-[1px] h-12 bg-slate-700/50" />
            <motion.div
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/20 bg-white p-1"
            >
              <img src={cmcsLogo} alt="CMCS Logo" className="w-full h-full object-contain" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-black gradient-text tracking-tighter mb-2 italic">University of Abra</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">College of Mathematics & Computing Science</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full py-4 text-lg shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
              <div className="flex items-center justify-center gap-3">
                <span className="font-black uppercase tracking-widest text-sm">Access Command</span>
                <LogIn size={20} />
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?
            <Link to="/register" className="text-indigo-400 font-bold ml-2 hover:text-indigo-300 transition-colors">Sign Up</Link>
          </p>
          <p className="text-slate-500 text-xs mt-4 opacity-50">
            Classroom Schedule Management System &copy; 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
