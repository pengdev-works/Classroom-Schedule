import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

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
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="premium-card w-full max-w-md bg-white/20"
      >
        <div className="text-center mb-8">
          <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.2, type: 'spring' }}
             className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30"
          >
            <LogIn className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text">UA Schedule</h1>
          <p className="text-slate-400 mt-2">Colleges of Math & Computing Science</p>
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
            className="btn-premium w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
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
