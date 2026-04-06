import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Users, Mail, Briefcase, Search, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Faculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', department: '', email: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFaculty = async () => {
        try {
            const response = await api.get('/faculty');
            setFaculty(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch faculty list', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/faculty', formData);
            Swal.fire('Success', 'Faculty member added', 'success');
            setShowModal(false);
            setFormData({ name: '', department: '', email: '' });
            fetchFaculty();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Failed to add faculty', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Faculty?',
            text: "This will remove their history as well.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Delete',
            background: '#1e293b',
            color: '#f1f5f9'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/faculty/${id}`);
                Swal.fire('Removed!', 'Faculty member deleted.', 'success');
                fetchFaculty();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete faculty', 'error');
            }
        }
    };

    const filteredFaculty = faculty.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="premium-card animate-pulse">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-800" />
                <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-5 bg-slate-800 rounded-md" />
                    <div className="w-1/2 h-4 bg-slate-800 rounded-md" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="w-full h-4 bg-slate-800 rounded-md" />
                <div className="w-2/3 h-4 bg-slate-800 rounded-md" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Faculty</h2>
                    <p className="text-slate-400">Manage teaching assignments and staff</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group no-print">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Find a faculty member..."
                            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 lg:w-80 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                      onClick={() => setShowModal(true)}
                      className="btn-premium"
                    >
                        <Plus size={18} />
                        Add Faculty
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFaculty.map((member) => (
                        <div key={member.id} className="premium-card group hover:scale-[1.02] active:scale-[0.98] transition-all cursor-default relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                <div className="flex gap-1">
                                  <button className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 transition-colors">
                                    <Edit3 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-indigo-500/5">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-lg font-black text-slate-100 truncate tracking-tight">{member.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{member.department}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-6 border-t border-slate-700/30">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                                        <Mail size={14} className="text-indigo-400" />
                                    </div>
                                    <span className="text-sm font-bold tracking-wide truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                                        <BadgeCheck size={14} className="text-purple-400" />
                                    </div>
                                    <span className="text-sm font-bold tracking-wide">Verified Faculty Member</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredFaculty.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4 glass-morphism border-2 border-dashed border-slate-800/50">
                            <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center text-slate-700 mb-2">
                                <Users size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">No staff members found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or check back later for updates.</p>
                            <button onClick={() => setShowModal(true)} className="text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-4 decoration-2 px-6 py-2 transition-all">
                                Register new colleague
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="premium-card w-full max-w-lg bg-slate-900 border-indigo-500/30"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-100 tracking-tight">Register Faculty</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.1em]">Staff Identification</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  required
                                  placeholder="e.g. Dr. Jane Doe"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Academic Department</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                  value={formData.department}
                                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                                  required
                                  placeholder="e.g. Math & Computing"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Connection</label>
                                <input 
                                  type="email"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  required
                                  placeholder="jane.doe@ua.edu.ph"
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button 
                                  type="button"
                                  onClick={() => setShowModal(false)}
                                  className="flex-1 px-8 py-4 rounded-2xl bg-slate-800/50 text-slate-400 font-bold hover:bg-slate-800 hover:text-slate-100 transition-all"
                                >
                                    Discard
                                </button>
                                <button type="submit" className="btn-premium flex-[2]">
                                    Register Account
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Faculty;
