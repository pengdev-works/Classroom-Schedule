import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Layers, BookOpen, Users, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Sections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', academic_program: '' });

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
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-premium flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create New Section
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <div key={section.id} className="premium-card group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                                    <Layers size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300">
                                    <Edit3 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(section.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-100 mb-2">{section.name}</h3>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <BookOpen size={16} className="text-indigo-500" />
                                <span>{section.academic_program}</span>
                            </div>
                            
                            <div className="mt-6 p-4 bg-slate-800/40 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Users size={14} />
                                    Active Student Group
                                </div>
                                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:bg-indigo-500 group-hover:text-white">Active</span>
                            </div>
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                            No sections registered yet.
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="premium-card w-full max-w-lg bg-slate-900 border-indigo-500/30">
                        <h3 className="text-xl font-bold mb-6">Register New Section</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Section Name</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  required
                                  placeholder="e.g. BSCS 4A"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Academic Program</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.academic_program}
                                  onChange={(e) => setFormData({...formData, academic_program: e.target.value})}
                                  required
                                  placeholder="e.g. Computer Science"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                  type="button"
                                  onClick={() => setShowModal(false)}
                                  className="flex-1 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-premium flex-1">
                                    Register Section
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sections;
