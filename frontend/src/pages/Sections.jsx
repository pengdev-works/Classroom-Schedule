import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Layers, BookOpen, Users, Search, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', academic_program: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const filteredSections = sections.filter(section => 
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.academic_program.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="premium-card animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-slate-800 mb-6" />
            <div className="w-3/4 h-6 bg-slate-800 rounded-md mb-2" />
            <div className="w-1/2 h-4 bg-slate-800 rounded-md mb-6" />
            <div className="w-full h-12 bg-slate-800 rounded-xl" />
        </div>
    );

    const fetchSections = async () => {
        try {
            const response = await api.get('/sections');
            setSections(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch sections', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sections', formData);
            Swal.fire('Success', 'Section added successfully', 'success');
            setShowModal(false);
            setFormData({ name: '', academic_program: '' });
            fetchSections();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Failed to add section', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Section?',
            text: "This may delete related schedules.",
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
                await api.delete(`/sections/${id}`);
                Swal.fire('Deleted!', 'Section has been removed.', 'success');
                fetchSections();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete section', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Sections</h2>
                    <p className="text-slate-400">Organize student groups and cohorts</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group no-print">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Find a section..."
                            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 lg:w-80 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {isAdmin && (
                        <button 
                          onClick={() => setShowModal(true)}
                          className="btn-premium"
                        >
                            <Plus size={18} />
                            Add Section
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSections.map((section) => (
                        <div key={section.id} className="premium-card group hover:scale-[1.02] active:scale-[0.98] transition-all cursor-default">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                    <Layers size={24} />
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                      <button className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 transition-colors">
                                        <Edit3 size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(section.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-100 tracking-tight mb-2 uppercase">{section.name}</h3>
                            <div className="flex items-center gap-3 text-slate-400 text-sm mb-6">
                                <GraduationCap size={16} className="text-indigo-400" />
                                <span className="font-bold">{section.academic_program}</span>
                            </div>
                            
                            <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl flex items-center justify-between group-hover:border-indigo-500/30 transition-colors">
                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Users size={14} className="text-slate-600" />
                                    Active Cohort
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20">Synced</span>
                            </div>
                        </div>
                    ))}
                    {filteredSections.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4 glass-morphism border-2 border-dashed border-slate-800/50">
                            <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center text-slate-700 mb-2">
                                <Layers size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">No sections found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or check back later for updates.</p>
                            {isAdmin && (
                                <button onClick={() => setShowModal(true)} className="text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-4 decoration-2 px-6 py-2 transition-all">
                                    Define new cohort
                                </button>
                            )}
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
                                <h3 className="text-2xl font-black text-slate-100 tracking-tight">Register Section</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.1em]">Group Identification</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Section Identifier</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-indigo-400 placeholder:text-slate-600"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  required
                                  placeholder="e.g. BSCS 4A"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Academic Program</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                  value={formData.academic_program}
                                  onChange={(e) => setFormData({...formData, academic_program: e.target.value})}
                                  required
                                  placeholder="e.g. Computer Science"
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
                                    Finish & Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Sections;
