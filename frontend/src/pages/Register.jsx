import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'You can now log in with your credentials.',
        background: '#1e293b',
        color: '#f1f5f9',
        confirmButtonColor: '#4f46e5'
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'Something went wrong',
        background: '#1e293b',
        color: '#f1f5f9'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative overflow-hidden bg-slate-950">
      {/* Background Orbs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/50 rounded-full blur-[160px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="premium-card w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border-indigo-500/20 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
             initial={{ scale: 0, rotate: 20 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
             className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/40 ring-4 ring-purple-500/10"
          >
            <UserPlus className="text-white w-12 h-12" />
          </motion.div>
          <h2 className="text-4xl font-black gradient-text tracking-tighter mb-2 italic">JOIN UA</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Create your unified account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
              <input 
                type="text" 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400" size={18} />
              <input 
                type="password" 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-100"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Role</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
              <select 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100 appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium w-full py-4 text-lg shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all mt-6"
          >
            {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : (
                <div className="flex items-center justify-center gap-3">
                    <span className="font-black uppercase tracking-widest text-sm">Register Account</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account? 
            <Link to="/login" className="text-indigo-400 font-bold ml-2 hover:text-indigo-300 transition-colors">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
