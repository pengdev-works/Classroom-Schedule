import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, BookOpen, Hash, Activity, Search, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ code: '', name: '', units: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const filteredSubjects = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const SkeletonCard = () => (
        <div className="premium-card animate-pulse">
            <div className="w-16 h-4 bg-slate-800 rounded-md mb-2" />
            <div className="w-3/4 h-6 bg-slate-800 rounded-md mb-6" />
            <div className="pt-4 border-t border-slate-800/50 flex gap-4">
                <div className="w-16 h-4 bg-slate-800 rounded-md" />
                <div className="w-16 h-4 bg-slate-800 rounded-md" />
            </div>
        </div>
    );

    const fetchSubjects = async () => {
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch subjects', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/subjects', formData);
            Swal.fire('Success', 'Subject added successfully', 'success');
            setShowModal(false);
            setFormData({ code: '', name: '', units: '' });
            fetchSubjects();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Failed to add subject', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Subject?',
            text: "This may affect existing schedules.",
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
                await api.delete(`/subjects/${id}`);
                Swal.fire('Deleted!', 'Subject has been removed.', 'success');
                fetchSubjects();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete subject', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Subjects</h2>
                    <p className="text-slate-400">Manage curriculum and academic courses</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group no-print">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Find a subject..."
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
                            Add Subject
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
                    {filteredSubjects.map((subject) => (
                        <div key={subject.id} className="premium-card group hover:scale-[1.02] active:scale-[0.98] transition-all cursor-default relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                <div className="flex gap-1">
                                  {isAdmin && (
                                    <>
                                      <button className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 transition-colors">
                                        <Edit3 size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(subject.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest mb-3">
                                    <Hash size={10} />
                                    {subject.code}
                                </div>
                                <h3 className="text-xl font-black text-slate-100 tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">{subject.name}</h3>
                            </div>
                            
                            <div className="flex items-center gap-5 pt-6 border-t border-slate-700/30">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                                        <Activity size={14} className="text-indigo-400" />
                                    </div>
                                    <span className="text-xs font-black tracking-widest uppercase">{subject.units} Units</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-slate-800/50">
                                        <BookmarkCheck size={14} className="text-purple-400" />
                                    </div>
                                    <span className="text-xs font-black tracking-widest uppercase">Verified</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredSubjects.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4 glass-morphism border-2 border-dashed border-slate-800/50">
                            <div className="w-20 h-20 rounded-full bg-slate-800/30 flex items-center justify-center text-slate-700 mb-2">
                                <BookOpen size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">Curriculum matching your search</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or check back later for updates.</p>
                            {isAdmin && (
                                <button onClick={() => setShowModal(true)} className="text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-4 decoration-2 px-6 py-2 transition-all">
                                    Create new course
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
                                <h3 className="text-2xl font-black text-slate-100 tracking-tight">Create Subject</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.1em]">Academic Coursework</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Code</label>
                                    <input 
                                      type="text"
                                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-indigo-400 placeholder:text-slate-600"
                                      value={formData.code}
                                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                                      required
                                      placeholder="CS101"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Title</label>
                                    <input 
                                      type="text"
                                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                      value={formData.name}
                                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                                      required
                                      placeholder="Introduction to Computing"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Units (Credit Hours)</label>
                                <input 
                                  type="number"
                                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-100"
                                  value={formData.units}
                                  onChange={(e) => setFormData({...formData, units: e.target.value})}
                                  required
                                  placeholder="3"
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
                                    Publish Course
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
