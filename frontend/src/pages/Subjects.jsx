import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, BookOpen, Hash, Activity, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ code: '', name: '', units: '' });

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
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn-premium flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New Subject
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <div key={subject.id} className="premium-card group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-300">
                                  <Edit3 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(subject.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                >
                                  <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">{subject.code}</div>
                                <h3 className="text-xl font-bold text-slate-100">{subject.name}</h3>
                            </div>
                            
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-800/50">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Activity size={14} className="text-indigo-500" />
                                    <span>{subject.units} Units</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <BookOpen size={14} className="text-purple-500" />
                                    <span>Core Subject</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {subjects.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                            No subjects registered yet.
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="premium-card w-full max-w-lg bg-slate-900 border-indigo-500/30">
                        <h3 className="text-xl font-bold mb-6">Create New Subject</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Subject Code</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.code}
                                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                                  required
                                  placeholder="e.g. CS101"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Subject Name</label>
                                <input 
                                  type="text"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  required
                                  placeholder="e.g. Introduction to Computing"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Units</label>
                                <input 
                                  type="number"
                                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={formData.units}
                                  onChange={(e) => setFormData({...formData, units: e.target.value})}
                                  required
                                  placeholder="3"
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
                                    Create Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
