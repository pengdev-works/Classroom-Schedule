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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="premium-card w-full max-w-md bg-white/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold gradient-text">Join CMCS</h2>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-medium">Create your account</p>
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
            className="btn-premium w-full py-4 flex items-center justify-center gap-2 group mt-4 h-14"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
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
